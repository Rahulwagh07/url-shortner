/*
  Warnings:

  - You are about to alter the column `uniqueVisitorId` on the `Visit` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[uniqueVisitorId]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Visit` MODIFY `uniqueVisitorId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Visitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `visitId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Visit_uniqueVisitorId_key` ON `Visit`(`uniqueVisitorId`);

-- AddForeignKey
ALTER TABLE `Visitor` ADD CONSTRAINT `Visitor_visitId_fkey` FOREIGN KEY (`visitId`) REFERENCES `Visit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
