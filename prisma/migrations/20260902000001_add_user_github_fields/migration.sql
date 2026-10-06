-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "githubUsername" TEXT,
ADD COLUMN IF NOT EXISTS "githubAccessToken" TEXT;
