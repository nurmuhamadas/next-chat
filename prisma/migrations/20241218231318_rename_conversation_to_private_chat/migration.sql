
-- AlterEnum
BEGIN;
CREATE TYPE "LogActivity_new" AS ENUM ('LOGIN', 'LOGOUT', 'RESET_PASSWORD', 'LOGIN_NEW_DEVICE', 'CREATE_PROFILE', 'UPDATE_PROFILE', 'UPDATE_SETTING', 'UPDATE_PRIVATE_CHAT_OPTION', 'CREATE_GROUP', 'UPDATE_GROUP', 'UPDATE_GROUP_OPTION', 'JOIN_GROUP', 'LEFT_GROUP', 'ADD_GROUP_MEMBER', 'REMOVE_GROUP_MEMBER', 'CREATE_CHANNEL', 'UPDATE_CHANNEL', 'UPDATE_CHANNEL_OPTION', 'SUBCRIBE_CHANNEL', 'UNSUBSCRIBE_CHANNEL', 'SEND_MESSAGE', 'UPDATE_MESSAGE', 'DELETE_MESSAGE', 'REACT_MESSAGE', 'BLOCK_USER', 'UNBLOCK_USER');
ALTER TABLE "user_logs" ALTER COLUMN "activity" TYPE "LogActivity_new" USING ("activity"::text::"LogActivity_new");
ALTER TYPE "LogActivity" RENAME TO "LogActivity_old";
ALTER TYPE "LogActivity_new" RENAME TO "LogActivity";
DROP TYPE "LogActivity_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "conversation_options" DROP CONSTRAINT "conversation_options_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "conversations" DROP CONSTRAINT "conversations_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversation_id_fkey";

-- AlterTable
ALTER TABLE "message_reads" DROP COLUMN "conversation_id",
ADD COLUMN     "private_chat_id" TEXT;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversation_id",
ADD COLUMN     "private_chat_id" TEXT;

-- DropTable
DROP TABLE "conversation_options";

-- DropTable
DROP TABLE "conversations";

-- CreateTable
CREATE TABLE "private_chats" (
    "id" TEXT NOT NULL,
    "user1_id" TEXT NOT NULL,
    "user2_id" TEXT NOT NULL,
    "last_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_chat_options" (
    "id" TEXT NOT NULL,
    "private_chat_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "notification" BOOLEAN NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_chat_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "private_chats_last_message_id_key" ON "private_chats"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "private_chats_user1_id_user2_id_key" ON "private_chats"("user1_id", "user2_id");

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
