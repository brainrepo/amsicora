/*
  Warnings:

  - Changed the type of `from` on the `Price` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `to` on the `Price` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Price" DROP COLUMN "from",
ADD COLUMN     "from" TIMESTAMPTZ NOT NULL,
DROP COLUMN "to",
ADD COLUMN     "to" TIMESTAMPTZ NOT NULL;
