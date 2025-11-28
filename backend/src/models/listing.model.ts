import mongoose from "mongoose";


const ListingSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    userID: {type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isSold: {type: Boolean, default: false}
}, {timestamps: true, versionKey: false})

export const Listing = mongoose.model("Listing", ListingSchema);