-- CreateTable
CREATE TABLE `Device` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mobile` INTEGER NULL,
    `tablet` INTEGER NULL,
    `desktop` INTEGER NULL,
    `eReader` INTEGER NULL,
    `unknown` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
