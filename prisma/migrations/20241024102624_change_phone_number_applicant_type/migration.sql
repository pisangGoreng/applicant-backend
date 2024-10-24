/*
  Warnings:

  - A unique constraint covering the columns `[phoneNumber]` on the table `Applicant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Applicant` MODIFY `phoneNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Applicant_phoneNumber_key` ON `Applicant`(`phoneNumber`);
