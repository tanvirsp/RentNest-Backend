/*
  Warnings:

  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tranId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[valId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "tranId" TEXT,
ADD COLUMN     "valId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_tranId_key" ON "payments"("tranId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_valId_key" ON "payments"("valId");
