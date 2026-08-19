-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

