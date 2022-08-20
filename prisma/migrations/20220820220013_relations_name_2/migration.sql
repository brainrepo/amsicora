/*
  Warnings:

  - You are about to drop the `_ResourceOnSeller` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SellerOnService` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ResourceOnSeller" DROP CONSTRAINT "_ResourceOnSeller_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResourceOnSeller" DROP CONSTRAINT "_ResourceOnSeller_B_fkey";

-- DropForeignKey
ALTER TABLE "_SellerOnService" DROP CONSTRAINT "_SellerOnService_A_fkey";

-- DropForeignKey
ALTER TABLE "_SellerOnService" DROP CONSTRAINT "_SellerOnService_B_fkey";

-- DropTable
DROP TABLE "_ResourceOnSeller";

-- DropTable
DROP TABLE "_SellerOnService";

-- CreateTable
CREATE TABLE "_SellerToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ResourceToSeller" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SellerToService_AB_unique" ON "_SellerToService"("A", "B");

-- CreateIndex
CREATE INDEX "_SellerToService_B_index" ON "_SellerToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ResourceToSeller_AB_unique" ON "_ResourceToSeller"("A", "B");

-- CreateIndex
CREATE INDEX "_ResourceToSeller_B_index" ON "_ResourceToSeller"("B");

-- AddForeignKey
ALTER TABLE "_SellerToService" ADD CONSTRAINT "_SellerToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SellerToService" ADD CONSTRAINT "_SellerToService_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSeller" ADD CONSTRAINT "_ResourceToSeller_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToSeller" ADD CONSTRAINT "_ResourceToSeller_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
