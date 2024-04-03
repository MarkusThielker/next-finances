/*
  Warnings:

  - You are about to drop the `lucia_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lucia_user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories"
    DROP CONSTRAINT "categories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entities"
    DROP CONSTRAINT "entities_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lucia_session"
    DROP CONSTRAINT "lucia_session_userId_fkey";

-- DropForeignKey
ALTER TABLE "payments"
    DROP CONSTRAINT "payments_user_id_fkey";

-- DropTable
DROP TABLE "lucia_session";

-- DropTable
DROP TABLE "lucia_user";
