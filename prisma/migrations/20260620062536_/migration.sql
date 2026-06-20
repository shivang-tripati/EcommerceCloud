/*
  Warnings:

  - A unique constraint covering the columns `[storeId,value]` on the table `Color` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,value]` on the table `Size` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Color_storeId_value_key" ON "Color"("storeId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "Size_storeId_value_key" ON "Size"("storeId", "value");
