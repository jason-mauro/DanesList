import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        email: { type: String, unique: true, required: true},
        roleID: { type: mongoose.Schema.Types.ObjectId,
            ref: "role"
        },
    }, {timestamps: true, versionKey: false});

export const User = mongoose.model('User', UserSchema);

