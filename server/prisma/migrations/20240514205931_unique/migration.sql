/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Device` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Device_userId_key` ON `Device`(`userId`);
