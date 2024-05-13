/*
  Warnings:

  - You are about to drop the column `isNewVisitor` on the `Visit` table. All the data in the column will be lost.
  - You are about to drop the column `isReturningVisitor` on the `Visit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Visit` DROP COLUMN `isNewVisitor`,
    DROP COLUMN `isReturningVisitor`,
    ADD COLUMN `returningVisitor` INTEGER NULL;
