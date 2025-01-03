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
ALTER TABLE "user_unread_messages" ADD CONSTRAINT "user_unread_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_unread_messages" ADD CONSTRAINT "user_unread_messages_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
