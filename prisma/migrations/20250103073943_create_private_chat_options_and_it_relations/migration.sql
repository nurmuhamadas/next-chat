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

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_private_chat_id_fkey" FOREIGN KEY ("private_chat_id") REFERENCES "private_chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_chat_options" ADD CONSTRAINT "private_chat_options_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
