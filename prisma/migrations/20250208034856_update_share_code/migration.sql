/*
  Warnings:

  - You are about to drop the column `share_link` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[share_code]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_share_link_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "share_link",
ADD COLUMN     "share_code" VARCHAR(8);

-- CreateIndex
CREATE UNIQUE INDEX "users_share_code_key" ON "users"("share_code");
