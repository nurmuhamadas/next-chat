-- CreateEnum
CREATE TYPE "DBTimeFormat" AS ENUM ('HALF_DAY', 'FULL_DAY');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en_US', 'id_ID');

-- CreateEnum
CREATE TYPE "Notification" AS ENUM ('PRIVATE', 'GROUP', 'CHANNEL');

-- CreateTable
CREATE TABLE "settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time_format" "DBTimeFormat" NOT NULL DEFAULT 'HALF_DAY',
    "language" "Language" NOT NULL DEFAULT 'en_US',
    "notifications" "Notification"[],
    "enable_2FA" BOOLEAN NOT NULL DEFAULT false,
    "show_last_seen" BOOLEAN NOT NULL DEFAULT true,
    "allow_add_to_group" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "settings_user_id_key" ON "settings"("user_id");

-- AddForeignKey
ALTER TABLE "settings" ADD CONSTRAINT "settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
