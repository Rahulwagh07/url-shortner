/*
  Warnings:

  - You are about to drop the column `country` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `countryWiseCounts` on the `Visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `country`,
    DROP COLUMN `countryWiseCounts`;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitId` INTEGER NOT NULL,
    `name` VARCHAR(191) NULL,
    `count` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
