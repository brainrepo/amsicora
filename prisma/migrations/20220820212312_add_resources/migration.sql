-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "serviceId" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceAmount" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "elapseDate" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "ResourceAmount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResourceToVariant" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_resourceAuthorizedSellers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResourceToVariant_AB_unique" ON "_ResourceToVariant"("A", "B");

-- CreateIndex
CREATE INDEX "_ResourceToVariant_B_index" ON "_ResourceToVariant"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_resourceAuthorizedSellers_AB_unique" ON "_resourceAuthorizedSellers"("A", "B");

-- CreateIndex
CREATE INDEX "_resourceAuthorizedSellers_B_index" ON "_resourceAuthorizedSellers"("B");

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToVariant" ADD CONSTRAINT "_ResourceToVariant_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResourceToVariant" ADD CONSTRAINT "_ResourceToVariant_B_fkey" FOREIGN KEY ("B") REFERENCES "Variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_resourceAuthorizedSellers" ADD CONSTRAINT "_resourceAuthorizedSellers_A_fkey" FOREIGN KEY ("A") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_resourceAuthorizedSellers" ADD CONSTRAINT "_resourceAuthorizedSellers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
