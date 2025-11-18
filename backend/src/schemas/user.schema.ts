import { z } from "zod";
import { Types } from "mongoose";

export const BaseUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.email("Invalid email address"),
    roleID: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid roleID (must be a valid ObjectId)",
      })
      .optional(),
  });

export const UserInputSchema = BaseUserSchema.omit({ roleID: true }).extend({
roleID: BaseUserSchema.shape.roleID.optional(), // still allow if provided
});
export type UserInput = z.infer<typeof UserInputSchema>;


export const UserDBSchema = BaseUserSchema.omit({ password: true, roleID: true }).extend({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});


export const UserLoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password required")
})


export type User = z.infer<typeof UserDBSchema>;

export const SignupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    username: z.string().min(3, "Username is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .transform((data) => ({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    username: data.username,
  }))
  
  // Ensures final transformed data matches the validated UserInput schema
  .pipe(UserInputSchema);


  