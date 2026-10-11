-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "vouchers_is_active_idx" ON "vouchers"("is_active");
