import { z } from "zod";
import { Types } from "mongoose";

export const ListingInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  userID: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid userID" }),
  isSold: z.boolean().optional().default(false),
});

export type ListingInput = z.infer<typeof ListingInputSchema>;

export const ListingDBSchema = ListingInputSchema.extend({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
  
export type Listing = z.infer<typeof ListingDBSchema>;

  