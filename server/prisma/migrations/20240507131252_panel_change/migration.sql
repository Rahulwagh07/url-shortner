/*
  Warnings:

  - You are about to alter the column `optionIcon` on the `Panel` table. The data in that column could be lost. The data in that column will be cast from `LongBlob` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `Panel` MODIFY `optionIcon` VARCHAR(191) NULL;
