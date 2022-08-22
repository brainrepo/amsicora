-- CreateTable
CREATE TABLE "ResourceAmountLocker" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "reservationId" TEXT NOT NULL,
    "resourceAmountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResourceAmountLocker_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResourceAmountLocker" ADD CONSTRAINT "ResourceAmountLocker_resourceAmountId_fkey" FOREIGN KEY ("resourceAmountId") REFERENCES "ResourceAmount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceAmountLocker" ADD CONSTRAINT "ResourceAmountLocker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
