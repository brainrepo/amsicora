-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
