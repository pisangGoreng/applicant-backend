-- AlterTable
ALTER TABLE `Applicant` ADD COLUMN `applicantRoleId` INTEGER NULL,
    ADD COLUMN `applicantStatusId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ApplicantRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicantRole_description_key`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ApplicantStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ApplicantStatus_description_key`(`description`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_applicantRoleId_fkey` FOREIGN KEY (`applicantRoleId`) REFERENCES `ApplicantRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Applicant` ADD CONSTRAINT `Applicant_applicantStatusId_fkey` FOREIGN KEY (`applicantStatusId`) REFERENCES `ApplicantStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
