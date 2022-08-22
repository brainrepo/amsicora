/*
  Warnings:

  - Added the required column `date` to the `ResourceAmount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shiftId` to the `ResourceAmount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResourceAmount" ADD COLUMN     "date" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "shiftId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ResourceAmount" ADD CONSTRAINT "ResourceAmount_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
