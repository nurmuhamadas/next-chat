/*
  Warnings:

  - Added the required column `room_id` to the `message_reads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "message_reads" ADD COLUMN     "room_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
