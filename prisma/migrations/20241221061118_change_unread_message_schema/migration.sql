/*
  Warnings:

  - You are about to drop the `message_reads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_last_message_read_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_room_id_fkey";

-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_user_id_fkey";

-- DropTable
DROP TABLE "message_reads";

-- CreateTable
CREATE TABLE "user_unread_messages" (
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_unread_messages_room_id_key" ON "user_unread_messages"("room_id");

-- AddForeignKey
ALTER TABLE "user_unread_messages" ADD CONSTRAINT "user_unread_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_unread_messages" ADD CONSTRAINT "user_unread_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
