-- CreateTable
CREATE TABLE "message_reads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_message_read_id" TEXT NOT NULL,
    "conversation_id" TEXT,
    "group_id" TEXT,
    "channel_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "message_reads_pkey" PRIMARY KEY ("id")
);
