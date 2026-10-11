/*
  Warnings:

  - You are about to drop the column `image` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `banners` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `brands` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `description_en` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `in_stock` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `original_price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `usage_limit` on the `vouchers` table. All the data in the column will be lost.
  - Added the required column `file` to the `banners` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "banners_is_active_idx";

-- DropIndex
DROP INDEX "brands_is_active_idx";

-- DropIndex
DROP INDEX "categories_is_active_idx";

-- DropIndex
DROP INDEX "products_in_stock_idx";

-- DropIndex
DROP INDEX "vouchers_is_active_idx";

-- AlterTable
ALTER TABLE "banners" DROP COLUMN "image",
DROP COLUMN "is_active",
DROP COLUMN "link",
DROP COLUMN "subtitle",
DROP COLUMN "title",
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "media_type" TEXT NOT NULL DEFAULT 'image';

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "description",
DROP COLUMN "is_active",
DROP COLUMN "website";

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "description",
DROP COLUMN "description_en",
DROP COLUMN "is_active",
ADD COLUMN     "name_ar" TEXT,
ADD COLUMN     "name_hi" TEXT,
ADD COLUMN     "name_ru" TEXT,
ADD COLUMN     "name_zh" TEXT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "in_stock",
DROP COLUMN "original_price",
ADD COLUMN     "description_ar" TEXT,
ADD COLUMN     "description_hi" TEXT,
ADD COLUMN     "description_ru" TEXT,
ADD COLUMN     "description_zh" TEXT,
ADD COLUMN     "name_ar" TEXT,
ADD COLUMN     "name_hi" TEXT,
ADD COLUMN     "name_ru" TEXT,
ADD COLUMN     "name_zh" TEXT;

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "is_active",
DROP COLUMN "usage_limit";
