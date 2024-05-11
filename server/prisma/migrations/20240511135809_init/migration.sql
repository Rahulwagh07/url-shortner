-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `shortCode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Category_name_key`(`name`),
    UNIQUE INDEX `Category_shortCode_key`(`shortCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accountType` VARCHAR(191) NOT NULL DEFAULT 'User',
    `token` VARCHAR(191) NULL,
    `resetPasswordExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Url` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `baseUrl` VARCHAR(191) NOT NULL,
    `urlName` VARCHAR(191) NOT NULL DEFAULT 'tiny',
    `description` VARCHAR(191) NULL,
    `shortUrl` VARCHAR(191) NULL,
    `tier` VARCHAR(191) NOT NULL DEFAULT 'temp',
    `categoryId` INTEGER NOT NULL,
    `creatorId` INTEGER NOT NULL,
    `newVisitors` INTEGER NOT NULL DEFAULT 0,
    `returningVisitors` INTEGER NOT NULL DEFAULT 0,
    `daysSinceActive` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `expirationDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Url_tier_idx`(`tier`),
    INDEX `Url_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TempUrl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `baseUrl` VARCHAR(191) NOT NULL,
    `shortUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `TempUrl_shortUrl_key`(`shortUrl`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Panel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `optionName` VARCHAR(191) NULL,
    `optionIcon` VARCHAR(191) NULL,
    `redirectionUrl` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OTP` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Global` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tempUrlActiveDays` INTEGER NOT NULL DEFAULT 10,
    `silverUrlActiveDays` INTEGER NOT NULL DEFAULT 10,
    `goldUrlActiveDays` INTEGER NOT NULL DEFAULT 10,
    `platinumUrlActiveDays` INTEGER NOT NULL DEFAULT 10,
    `reportExpirationDays` INTEGER NOT NULL DEFAULT 10,
    `maxReportRecords` INTEGER NOT NULL DEFAULT 10,
    `generateReportDisabled` BOOLEAN NOT NULL DEFAULT false,
    `generatedReportDisabled` BOOLEAN NOT NULL DEFAULT false,
    `pauseGeneratedReportDisabled` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedWord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BlockedDomain` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Visit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `country` VARCHAR(191) NULL,
    `count` INTEGER NOT NULL,
    `urlId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Url` ADD CONSTRAINT `Url_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_urlId_fkey` FOREIGN KEY (`urlId`) REFERENCES `Url`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
