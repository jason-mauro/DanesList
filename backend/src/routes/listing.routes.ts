import express from "express";
import {createListing, getListing, getListings, getListingCategories, addCategory} from "../controllers/listing.controller.js"
import protectRoute from "../utils/protectRoute.js";

const listingRouter = express.Router();

listingRouter.post("/create", protectRoute, createListing);

listingRouter.get("/categories", protectRoute, getListingCategories )

listingRouter.post("/add-category", protectRoute, addCategory)

listingRouter.get("/:id", protectRoute, getListing);

listingRouter.get("", protectRoute, getListings);


export default listingRouter;