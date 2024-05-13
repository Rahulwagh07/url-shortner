/*
  Warnings:

  - You are about to drop the column `daysSinceActive` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `newVisitors` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `returningVisitors` on the `Url` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Url` DROP COLUMN `daysSinceActive`,
    DROP COLUMN `newVisitors`,
    DROP COLUMN `returningVisitors`;

-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `count`,
    ADD COLUMN `countryWiseCounts` JSON NULL,
    ADD COLUMN `totalClicks` INTEGER NOT NULL DEFAULT 1;

-- RenameIndex
ALTER TABLE `Visit` RENAME INDEX `Visit_urlId_fkey` TO `Visit_urlId_idx`;
