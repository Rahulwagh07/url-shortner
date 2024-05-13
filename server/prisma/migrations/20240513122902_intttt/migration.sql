/*
  Warnings:

  - You are about to drop the column `uniqueVisitorId` on the `Visit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Visit_uniqueVisitorId_key` ON `Visit`;

-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `uniqueVisitorId`;

-- AlterTable
ALTER TABLE `Visitor` ADD COLUMN `uniqueVisitorId` VARCHAR(191) NULL;
