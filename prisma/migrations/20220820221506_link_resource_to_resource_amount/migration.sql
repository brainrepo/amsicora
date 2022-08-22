/*
  Warnings:

  - Added the required column `resourceId` to the `ResourceAmount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResourceAmount" ADD COLUMN     "resourceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ResourceAmount" ADD CONSTRAINT "ResourceAmount_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
