-- AlterTable
ALTER TABLE "entities"
    ADD COLUMN "default_category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "entities"
    ADD CONSTRAINT "entities_default_category_id_fkey" FOREIGN KEY ("default_category_id") REFERENCES "categories" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
