/*
  Warnings:

  - You are about to drop the column `uniqueVisitor` on the `Visit` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Visit_urlId_key` ON `Visit`;

-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `uniqueVisitor`;
