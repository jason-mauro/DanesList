import { z } from "zod";
import { Types } from "mongoose";

export const UserZodSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  email: z.string().email("Invalid email address"),
  roleID: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
      message: "Invalid roleID (must be a valid ObjectId)",
    }),
});

export const UserInputSchema = UserZodSchema;
export type UserInput = z.infer<typeof UserInputSchema>;

export const UserDBSchema = UserZodSchema.extend({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
  
export type User = z.infer<typeof UserDBSchema>;
  