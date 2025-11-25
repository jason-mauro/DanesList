import {Request, Response} from "express";
import {Listing} from "../models/listing.model.js";
import { Category } from "../models/category.model.js";
import mongoose from "mongoose";

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

    pipeline.push({ $sort: sortAttributeMap[sortBy]})
    pipeline.push({ $skip: (page - 1) * limit})
    pipeline.push({ $limit: limit})

    const listings = await Listing.aggregate(pipeline);

    return res.status(200).json({ listings, page, limit})

    } catch (err: any) {
      res.status(500).json({ error : err.message });
    }
};



// GET /listings/:id
export const getListing = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid listing ID" });
        }

        const listing = await Listing.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
        
            {
              $lookup: {
                from: "listingcategories",
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
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    { $project: { password: 0 } } // remove password
                  ]
              }
            }
          ]);

        if (!listing) 
            return res.status(400).json({error: "Listing not found"})

        return res.status(200).json(listing[0]);
    } catch (err: any){
        res.status(500).json({error: err.message});
    }
}