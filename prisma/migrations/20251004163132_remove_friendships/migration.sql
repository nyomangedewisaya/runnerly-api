/*
  Warnings:

  - You are about to alter the column `activityTimestamp` on the `activities` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `startDate` on the `challenges` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `endDate` on the `challenges` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the `friendships` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `friendships` DROP FOREIGN KEY `friendships_followingUserId_fkey`;

-- DropForeignKey
ALTER TABLE `friendships` DROP FOREIGN KEY `friendships_userId_fkey`;

-- AlterTable
ALTER TABLE `activities` MODIFY `activityTimestamp` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `challenges` MODIFY `startDate` DATETIME NOT NULL,
    MODIFY `endDate` DATETIME NOT NULL;

-- DropTable
DROP TABLE `friendships`;
