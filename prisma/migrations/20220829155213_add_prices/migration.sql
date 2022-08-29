-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "cost" DECIMAL(65,30) NOT NULL,
    "fee" DECIMAL(65,30) NOT NULL,
    "from" DATE NOT NULL,
    "to" DATE NOT NULL,
    "shiftId" TEXT NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PriceToSeller" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToSeller_AB_unique" ON "_PriceToSeller"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToSeller_B_index" ON "_PriceToSeller"("B");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToSeller" ADD CONSTRAINT "_PriceToSeller_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToSeller" ADD CONSTRAINT "_PriceToSeller_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
