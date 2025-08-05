-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assignedDevId" INTEGER;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedDevId_fkey" FOREIGN KEY ("assignedDevId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
