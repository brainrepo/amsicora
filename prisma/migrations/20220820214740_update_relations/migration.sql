/*
  Warnings:

  - You are about to drop the `_resourceAuthorizedSellers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_sellableServices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_resourceAuthorizedSellers" DROP CONSTRAINT "_resourceAuthorizedSellers_A_fkey";

-- DropForeignKey
ALTER TABLE "_resourceAuthorizedSellers" DROP CONSTRAINT "_resourceAuthorizedSellers_B_fkey";

-- DropForeignKey
ALTER TABLE "_sellableServices" DROP CONSTRAINT "_sellableServices_A_fkey";

-- DropForeignKey
ALTER TABLE "_sellableServices" DROP CONSTRAINT "_sellableServices_B_fkey";

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resourceId" TEXT;

-- DropTable
DROP TABLE "_resourceAuthorizedSellers";

-- DropTable
DROP TABLE "_sellableServices";

-- CreateTable
CREATE TABLE "_SellerOnService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SellersOnResource" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SellerOnService_AB_unique" ON "_SellerOnService"("A", "B");

-- CreateIndex
CREATE INDEX "_SellerOnService_B_index" ON "_SellerOnService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SellersOnResource_AB_unique" ON "_SellersOnResource"("A", "B");

-- CreateIndex
CREATE INDEX "_SellersOnResource_B_index" ON "_SellersOnResource"("B");

-- AddForeignKey
ALTER TABLE "_SellerOnService" ADD CONSTRAINT "_SellerOnService_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SellerOnService" ADD CONSTRAINT "_SellerOnService_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SellersOnResource" ADD CONSTRAINT "_SellersOnResource_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SellersOnResource" ADD CONSTRAINT "_SellersOnResource_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
