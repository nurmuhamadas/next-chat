/*
  Warnings:

  - A unique constraint covering the columns `[device_id,user_id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sessions_device_id_user_id_key" ON "sessions"("device_id", "user_id");
