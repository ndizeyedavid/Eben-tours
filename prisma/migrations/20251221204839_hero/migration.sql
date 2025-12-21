-- CreateEnum
CREATE TYPE "HeroMediaType" AS ENUM ('image', 'video');

-- CreateTable
CREATE TABLE "HeroMedia" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "HeroMediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroMedia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HeroMedia_enabled_idx" ON "HeroMedia"("enabled");

-- CreateIndex
CREATE UNIQUE INDEX "HeroMedia_position_key" ON "HeroMedia"("position");
