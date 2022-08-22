/*
  Warnings:

  - You are about to drop the column `userId` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the `_ResourceToSeller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ResourceToSeller" DROP CONSTRAINT "_ResourceToSeller_A_fkey";

-- DropForeignKey
ALTER TABLE "_ResourceToSeller" DROP CONSTRAINT "_ResourceToSeller_B_fkey";

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "userId";

-- DropTable
DROP TABLE "_ResourceToSeller";

-- CreateTable
CREATE TABLE "_ResourceAmountToSeller" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResourceAmountToSeller_AB_unique" ON "_ResourceAmountToSeller"("A", "B");

-- CreateIndex
CREATE INDEX "_ResourceAmountToSeller_B_index" ON "_ResourceAmountToSeller"("B");

-- AddForeignKey
ALTER TABLE "_ResourceAmountToSeller" ADD CONSTRAINT "_ResourceAmountToSeller_A_fkey" FOREIGN KEY ("A") REFERENCES "ResourceAmount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceAmountToSeller" ADD CONSTRAINT "_ResourceAmountToSeller_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
