import {Request, Response} from "express";
import {Listing} from "../models/listing.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";
import { ListingInputSchema } from "../schemas/listing.schema.js";
import { ListingImage } from "../models/listingImage.model.js"
import { CategoryInputSchema } from "../schemas/category.schema.js";
import { ListingCategory } from "../models/listingCategory.model.js";
const sortAttributeMap: Record<string, Record<string, 1 | -1>> = {
    newest:   { createdAt: -1 },
    oldest:   { createdAt: 1 },
    maxPrice: { price: -1 },
    minPrice: { price: 1 }
  };

// GET /listings/limit=20&page=1&category="newest"
export const getListings = async (req: Request, res: Response) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const sortBy = (req.query.sortBy as string | undefined) ?? "newest";
      const categoryName = (req.query.category as string | undefined) ?? null;

    // if a category filter is provided, fetch its _id first
    let categoryID: mongoose.Types.ObjectId | null = null;
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName }).select("_id");
      if (!category) {
        // if category name invalid, return empty list (or whatever UX you prefer)
        return res.status(200).json({ listings: [], total: 0, page, limit });
      }
      categoryID = category._id as mongoose.Types.ObjectId;
    }

    // build pipeline
    const pipeline: any[] = [
      {
        $lookup: {
          from: "listingCategories",   
          localField: "_id",
          foreignField: "listingID",
          as: "categoryLinks"
        }
      }
    ];

    // add match by category if provided
    if (categoryID) {
      pipeline.push({
        $match: { "categoryLinks.categoryID": categoryID }
      });
    }

    // image lookup
    pipeline.push({
      $lookup: {
        from: "listingImages",
        localField: "_id",
        foreignField: "listingID",
        as: "images"
      }
    });

    // user lookup
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "userID",
        foreignField: "_id",
        as: "user",
        pipeline: [
          { $project: { password: 0 } }
        ]
      }
    });

    // Transform the arrays to extract just the values you need
    pipeline.push({
      $addFields: {
        images: "$images.image",
        user: { $arrayElemAt: ["$user", 0] }
      }
    });

    // Remove intermediate fields
    pipeline.push({
      $project: {
        categoryLinks: 0
      }
    });

    pipeline.push({ $sort: sortAttributeMap[sortBy] });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const listings = await Listing.aggregate(pipeline);

    return res.status(200).json({ listings, page})

    } catch (err: any) {
      res.status(500).json({ error : err.message });
    }
};



// GET /listings/:id
export const getListing = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ error: "Invalid listing ID" });
        }

        const [listing] = await Listing.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(id) } },
        
          {
            $lookup: {
              from: "listingCategories",
              localField: "_id",
              foreignField: "listingID",
              as: "categoryLinks"
            }
          },
        
          {
            $lookup: {
              from: "categories",
              localField: "categoryLinks.categoryID",
              foreignField: "_id",
              as: "categories"
            }
          },
          {
            $lookup: {
              from: "listingImages",
              localField: "_id",
              foreignField: "listingID",
              as: "images"
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "userID",
              foreignField: "_id",
              as: "user",
              pipeline: [
                { $project: { password: 0 } }
              ]
            }
          },
          {
            $addFields: {
              images: "$images.image",
              categories: "$categories.name",
              user: { $arrayElemAt: ["$user", 0] }  // Convert user array to single object
            }
          },
          {
            $project: {
              categoryLinks: 0  // remove intermediate category
            }
          }
        ]);

        if (!listing) 
            return res.status(400).json({error: "Listing not found"})

        return res.status(200).json(listing);
    } catch (err: any){
        res.status(500).json({error: err.message});
    }
}

export const createListing = async (req: Request, res: Response) => {
  try {
    // A listing request should come in req.body with form of 
    // Listing, categories [string], images [string]
    const { categories, images, ...listingData} = req.body;

    // We don't send the userID from the form data, but we get it from protected route
    listingData.userID = String(req.user?._id);
    console.log("parsing")
    const listingInput = ListingInputSchema.parse(listingData);
    console.log("parsed success")

    const listing = new Listing(listingInput);

    await listing.save(); 

    const listingID = listing._id;

    // Create the image listing documents
    await Promise.all(
      images.map(async (image: string) => {
        const listingImage = new ListingImage({image, listingID});
        await listingImage.save();
      })
    );

    // Create category listing documents
    await Promise.all(
      images.map(async (categoryName: string) => {
        if (categoryName.trim().length == 0){
          return;
        }
        const category = await Category.findOne({name: categoryName})
        const categoryID = category?._id
        const listingCategory = new ListingCategory({listingID, categoryID})
        await listingCategory.save();
      })
    )

    return res.status(200).json(listing);

  } catch (error: any){
    return res.status(500).json({message: error.message});
  }
}

export const getListingCategories = async (req: Request, res: Response) => {
  try {
    const names = await Category.distinct("name");
    return res.json(names);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
}

export const addCategory =  async (req: Request, res:Response) => {
  try {
    const { name } = req.query;

    // Validate with Zod
    const parsed = CategoryInputSchema.safeParse({ name });

    // Create category
    const category = await Category.create(parsed.data);

    return res.status(200).json(category);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};