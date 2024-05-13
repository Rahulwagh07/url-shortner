-- AlterTable
ALTER TABLE `Visit` ADD COLUMN `isNewVisitor` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isReturningVisitor` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `uniqueVisitorId` VARCHAR(191) NULL;
