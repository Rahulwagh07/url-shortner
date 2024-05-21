-- CreateTable
CREATE TABLE `Stats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `totalLinksCreated` INTEGER NULL DEFAULT 0,
    `totalLinksVisited` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
