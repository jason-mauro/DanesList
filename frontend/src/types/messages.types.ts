import type { User } from "./user.type"

export type MessageData = {
    senderId: string,
    receiverId: string,
    message: string,
    createdAt: string,
    updatedAt: string,
    _id: string
}

export type ConversationData = {
    otherUser: User
    lastMessage: string,
    conversationId: string,
    updatedAt: string
}