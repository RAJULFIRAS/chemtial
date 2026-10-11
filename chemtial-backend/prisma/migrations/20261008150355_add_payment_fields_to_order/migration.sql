-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "payment_note" TEXT,
ADD COLUMN     "payment_proof" TEXT,
ADD COLUMN     "payment_reference" TEXT;
