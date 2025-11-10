import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema({
    title: {type: String, required: true}
}, {versionKey: false})

export const Role = mongoose.model("Role", RoleSchema);