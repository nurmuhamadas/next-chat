-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_group_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_private_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "private_chat_options" DROP CONSTRAINT "private_chat_options_private_chat_id_fkey";

-- DropForeignKey
ALTER TABLE "private_chats" DROP CONSTRAINT "private_chats_user1_id_fkey";

-- DropForeignKey
ALTER TABLE "private_chats" DROP CONSTRAINT "private_chats_user2_id_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_private_chat_id_fkey";

-- DropIndex
DROP INDEX "channels_last_message_id_key";

-- DropIndex
DROP INDEX "groups_last_message_id_key";

-- AlterTable
ALTER TABLE "channels" DROP COLUMN "last_message_id";

-- AlterTable
ALTER TABLE "groups" DROP COLUMN "last_message_id";

-- AlterTable
ALTER TABLE "message_reads" DROP COLUMN "channel_id",
DROP COLUMN "group_id",
DROP COLUMN "private_chat_id",
ADD COLUMN     "room_id" TEXT;

-- AlterTable
ALTER TABLE "private_chat_options" DROP COLUMN "private_chat_id",
ADD COLUMN     "room_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "private_chats";

-- CreateIndex
CREATE UNIQUE INDEX "private_chat_options_room_id_key" ON "private_chat_options"("room_id");

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
