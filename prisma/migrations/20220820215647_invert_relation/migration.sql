/*
  Warnings:

  - You are about to drop the `_SellersOnResource` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SellersOnResource" DROP CONSTRAINT "_SellersOnResource_A_fkey";

-- DropForeignKey
ALTER TABLE "_SellersOnResource" DROP CONSTRAINT "_SellersOnResource_B_fkey";

-- DropTable
DROP TABLE "_SellersOnResource";

-- CreateTable
CREATE TABLE "_ResourceOnSeller" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResourceOnSeller_AB_unique" ON "_ResourceOnSeller"("A", "B");

-- CreateIndex
CREATE INDEX "_ResourceOnSeller_B_index" ON "_ResourceOnSeller"("B");

-- AddForeignKey
ALTER TABLE "_ResourceOnSeller" ADD CONSTRAINT "_ResourceOnSeller_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceOnSeller" ADD CONSTRAINT "_ResourceOnSeller_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
