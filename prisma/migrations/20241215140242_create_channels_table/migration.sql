-- CreateEnum
CREATE TYPE "ChannelType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "type" "ChannelType" NOT NULL,
    "image_url" TEXT,
    "owner_id" TEXT NOT NULL,
    "invite_code" CHAR(10) NOT NULL,
    "last_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channels_invite_code_key" ON "channels"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "channels_last_message_id_key" ON "channels"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "channels_owner_id_name_key" ON "channels"("owner_id", "name");
