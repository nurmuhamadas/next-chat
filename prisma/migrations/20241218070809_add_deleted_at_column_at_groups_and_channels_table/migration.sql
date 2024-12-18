-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "groups" ADD COLUMN     "deleted_at" TIMESTAMP(3);
