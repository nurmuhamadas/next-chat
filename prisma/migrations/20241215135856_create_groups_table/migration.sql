-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "groups" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "type" "GroupType" NOT NULL,
    "image_url" TEXT,
    "owner_id" TEXT NOT NULL,
    "invite_code" CHAR(10) NOT NULL,
    "last_message_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "groups_invite_code_key" ON "groups"("invite_code");

-- CreateIndex
CREATE UNIQUE INDEX "groups_last_message_id_key" ON "groups"("last_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "groups_owner_id_name_key" ON "groups"("owner_id", "name");
