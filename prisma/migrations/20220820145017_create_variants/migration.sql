-- CreateTable
CREATE TABLE "Variants" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Variants_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
