/*
  Warnings:

  - You are about to drop the column `room_id` on the `message_reads` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `room_id` on the `private_chat_options` table. All the data in the column will be lost.
  - You are about to drop the column `last_message_id` on the `rooms` table. All the data in the column will be lost.
  - You are about to drop the column `user_pair_id` on the `rooms` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[last_message_id]` on the table `channels` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[last_message_id]` on the table `groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[private_chat_id]` on the table `private_chat_options` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `private_chat_id` to the `private_chat_options` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_room_id_fkey";

-- DropForeignKey
ALTER TABLE "private_chat_options" DROP CONSTRAINT "private_chat_options_room_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_last_message_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_user_pair_id_fkey";

-- DropIndex
DROP INDEX "private_chat_options_room_id_key";

-- DropIndex
DROP INDEX "rooms_last_message_id_key";

-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "last_message_id" TEXT;

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "last_message_id" TEXT;

-- AlterTable
ALTER TABLE "message_reads" DROP COLUMN "room_id";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "room_id",
ADD COLUMN     "channel_id" TEXT,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "private_chat_id" TEXT;

-- AlterTable
ALTER TABLE "private_chat_options" DROP COLUMN "room_id",
ADD COLUMN     "private_chat_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "rooms" DROP COLUMN "last_message_id",
DROP COLUMN "user_pair_id",
ADD COLUMN     "private_chat_id" TEXT;

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

-- CreateIndex
CREATE UNIQUE INDEX "private_chats_last_message_id_key" ON "private_chats"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "private_chats_user1_id_user2_id_key" ON "private_chats"("user1_id", "user2_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_last_message_id_key" ON "channels"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_last_message_id_key" ON "groups"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "private_chat_options_private_chat_id_key" ON "private_chat_options"("private_chat_id");

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_user1_id_fkey" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_user2_id_fkey" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chats" ADD CONSTRAINT "private_chats_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;
