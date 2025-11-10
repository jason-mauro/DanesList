import { z } from "zod";
import { Types } from "mongoose";

export const MessageZodSchema = z.object({
  senderId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid senderId" }),
  receiverId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), { message: "Invalid receiverId" }),
  message: z.string().min(1, "Message cannot be empty"),
});


export const MessageDBZodSchema = MessageZodSchema.extend({
    _id: z.instanceof(Types.ObjectId),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });
  
  export type MessageInput = z.infer<typeof MessageZodSchema>;
  export type Message = z.infer<typeof MessageDBZodSchema>;