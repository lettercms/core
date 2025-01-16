-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "views" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "View" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "slug" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "browser" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "blogId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "View_id_key" ON "View"("id");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
