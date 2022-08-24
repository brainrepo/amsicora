/*
  Warnings:

  - You are about to drop the column `userId` on the `ResourceAmountLocker` table. All the data in the column will be lost.
  - Added the required column `sellerId` to the `ResourceAmountLocker` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ResourceAmountLocker" DROP CONSTRAINT "ResourceAmountLocker_userId_fkey";

-- AlterTable
ALTER TABLE "ResourceAmountLocker" DROP COLUMN "userId",
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ResourceAmountLocker" ADD CONSTRAINT "ResourceAmountLocker_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
