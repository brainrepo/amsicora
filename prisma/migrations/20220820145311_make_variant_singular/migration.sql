/*
  Warnings:

  - You are about to drop the `Variants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variants" DROP CONSTRAINT "Variants_serviceId_fkey";

-- DropTable
DROP TABLE "Variants";

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
