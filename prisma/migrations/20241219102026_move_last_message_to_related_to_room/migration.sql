/*
  Warnings:

  - You are about to drop the column `last_message_id` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `last_message_id` on the `groups` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "channels" DROP CONSTRAINT "channels_last_message_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_last_message_id_fkey";

-- DropForeignKey
ALTER TABLE "private_chats" DROP CONSTRAINT "private_chats_last_message_id_fkey";

-- DropIndex
DROP INDEX "channels_last_message_id_key";

-- DropIndex
DROP INDEX "groups_last_message_id_key";

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "last_message_id";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "last_message_id";

-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "last_message_id" TEXT;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
