/*
  Warnings:

  - You are about to drop the column `custonDomain` on the `Blog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Blog" DROP COLUMN "custonDomain",
ADD COLUMN     "customDomain" TEXT;
