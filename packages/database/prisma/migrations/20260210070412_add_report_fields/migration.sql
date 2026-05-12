-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "diagnosticComment" TEXT,
ADD COLUMN     "laboratoryComment" TEXT,
ADD COLUMN     "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
