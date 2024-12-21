/*
  Warnings:

  - A unique constraint covering the columns `[room_id]` on the table `message_reads` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "message_reads_room_id_key" ON "message_reads"("room_id");
