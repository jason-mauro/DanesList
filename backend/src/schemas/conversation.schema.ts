import { z } from "zod";
import { Types } from "mongoose";

export const ConversationZodSchema = z.object({
    participants: z
      .array(
        z.string().refine((val) => Types.ObjectId.isValid(val), { message: "Invalid participantId" })
      )
      .nonempty("Conversation must have at least one participant"),

    lastMessage: z.instanceof(Types.ObjectId).optional()
  });
  

export const ConversationDBZodSchema = ConversationZodSchema.extend({
_id: z.instanceof(Types.ObjectId),
createdAt: z.date().optional(),
updatedAt: z.date().optional(),
});

export type ConversationInput = z.infer<typeof ConversationZodSchema>;
export type Conversation = z.infer<typeof ConversationDBZodSchema>;