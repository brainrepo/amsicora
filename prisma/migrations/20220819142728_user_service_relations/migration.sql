/*
  Warnings:

  - The primary key for the `Services` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Services" DROP CONSTRAINT "Services_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Services_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Services_id_seq";

-- CreateTable
CREATE TABLE "_sellableServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_sellableServices_AB_unique" ON "_sellableServices"("A", "B");

-- CreateIndex
CREATE INDEX "_sellableServices_B_index" ON "_sellableServices"("B");

-- AddForeignKey
ALTER TABLE "_sellableServices" ADD CONSTRAINT "_sellableServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_sellableServices" ADD CONSTRAINT "_sellableServices_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
