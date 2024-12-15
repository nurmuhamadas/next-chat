-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('DEFAULT', 'DELETED_FOR_ME', 'DELETED_FOR_ALL', 'DELETED_BY_ADMIN');

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "message" TEXT,
    "sender_id" TEXT NOT NULL,
    "conversation_id" TEXT,
    "group_id" TEXT,
    "channel_id" TEXT,
    "parent_message_id" TEXT,
    "parent_message_name" VARCHAR(100),
    "parent_message_text" TEXT,
    "original_message_id" TEXT,
    "is_emoji_only" BOOLEAN NOT NULL DEFAULT false,
    "status" "MessageStatus" NOT NULL DEFAULT 'DEFAULT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);
