-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "channel_id" TEXT,
ADD COLUMN     "group_id" TEXT,
ADD COLUMN     "private_chat_id" TEXT,
ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "rooms_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "rooms_private_chat_id_key" ON "rooms"("private_chat_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_group_id_key" ON "rooms"("group_id");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_channel_id_key" ON "rooms"("channel_id");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_last_message_id_fkey" FOREIGN KEY ("last_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
