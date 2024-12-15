-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "reaction" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reactions_user_id_message_id_key" ON "reactions"("user_id", "message_id");
