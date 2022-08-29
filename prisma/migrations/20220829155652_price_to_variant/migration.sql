-- CreateTable
CREATE TABLE "_PriceToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PriceToVariant_AB_unique" ON "_PriceToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_PriceToVariant_B_index" ON "_PriceToVariant"("B");

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PriceToVariant" ADD CONSTRAINT "_PriceToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
