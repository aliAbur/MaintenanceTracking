'use server'

import { prisma } from './prisma';
import { TicketStatus, TicketPriority } from '@prisma/client';

export async function getTickets(showClosed: boolean = false) {
  const tickets = await prisma.ticket.findMany({
    where: showClosed ? undefined : {
      status: {
        not: 'Closed'
      }
    },
    include: {
      assignee: true
    },
    orderBy: {
      customerName: 'asc'
    }
  });
  
  return tickets;
}

export async function getTicketById(id: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      assignee: true
    }
  });

  return ticket;
}

export async function getAuditLogsForTicket(ticketId: string) {
  const logs = await prisma.auditLog.findMany({
    where: { ticketId },
    include: {
      modifier: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return logs;
}

export async function createTicket(formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const panelType = formData.get('panelType') as string;
  const priority = formData.get('priority') as TicketPriority;
  const specialNotes = formData.get('specialNotes') as string;
  const assignedTo = formData.get('assignedTo') as string;

  // In a real application, you'd get this from the session
  const mockUserId = '11111111-1111-1111-1111-111111111111';

  // Use a transaction to ensure both ticket and log are created together
  const ticket = await prisma.$transaction(async (tx) => {
    const newTicket = await tx.ticket.create({
      data: {
        customerName,
        customerPhone,
        panelType,
        priority,
        specialNotes: specialNotes || null,
        assignedTo: assignedTo || null,
        status: 'Open',
      }
    });

    await tx.auditLog.create({
      data: {
        ticketId: newTicket.id,
        modifiedBy: mockUserId,
        action: 'Ticket Created',
        oldValue: null,
        newValue: 'Open'
      }
    });

    return newTicket;
  });

  return ticket;
}

export async function updateTicketStatus(ticketId: string, newStatus: TicketStatus, oldStatus: TicketStatus) {
  const mockUserId = '11111111-1111-1111-1111-111111111111';

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus }
    });

    await tx.auditLog.create({
      data: {
        ticketId,
        modifiedBy: mockUserId,
        action: 'Status changed',
        oldValue: oldStatus,
        newValue: newStatus
      }
    });
  });
}
