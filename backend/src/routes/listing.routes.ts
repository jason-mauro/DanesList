import express from "express";
import {createListing, getListing, getListings, getListingCategories, addCategory, updateListing, deleteListing, updateFavorite,  getFavorite} from "../controllers/listing.controller.js"
import protectRoute from "../utils/protectRoute.js";

const listingRouter = express.Router();

listingRouter.post("/create", protectRoute, createListing);

listingRouter.post("/update", protectRoute, updateListing);

listingRouter.post("/delete", protectRoute, deleteListing);

listingRouter.post("/favorite/:id", protectRoute, updateFavorite);

listingRouter.get("/favorite/:id", protectRoute, getFavorite);

listingRouter.get("/categories", protectRoute, getListingCategories )

listingRouter.post("/add-category", protectRoute, addCategory)

listingRouter.get("/:id", protectRoute, getListing);

listingRouter.get("", protectRoute, getListings);


export default listingRouter;