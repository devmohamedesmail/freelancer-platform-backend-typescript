/*
  Warnings:

  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provider_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `provider_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `provider_name` VARCHAR(191) NOT NULL;
