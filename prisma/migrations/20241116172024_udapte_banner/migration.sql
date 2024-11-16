-- CreateEnum
CREATE TYPE "BannerType" AS ENUM ('banner', 'add');

-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "type" "BannerType" NOT NULL DEFAULT 'banner';

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "isFeature" BOOLEAN NOT NULL DEFAULT false;
