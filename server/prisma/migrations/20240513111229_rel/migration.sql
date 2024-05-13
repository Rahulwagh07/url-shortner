/*
  Warnings:

  - A unique constraint covering the columns `[urlId]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Visit` DROP FOREIGN KEY `Visit_urlId_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Visit_urlId_key` ON `Visit`(`urlId`);
