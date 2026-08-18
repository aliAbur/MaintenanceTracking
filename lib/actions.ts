'use server'

import { prisma } from './prisma';
import { TicketStatus, TicketPriority } from '@prisma/client';

async function getOrCreateSystemUser() {
  let user = await prisma.userProfile.findUnique({ where: { email: 'system@panelservice.app' } });
  if (!user) {
    user = await prisma.userProfile.create({
      data: {
        email: 'system@panelservice.app',
        fullName: 'System Operator',
        role: 'Admin'
      }
    });
  }
  return user.id;
}

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
      createdAt: 'desc'
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

  const systemUserId = await getOrCreateSystemUser();

  const ticket = await prisma.$transaction(async (tx) => {
    const newTicket = await tx.ticket.create({
      data: {
        customerName,
        customerPhone: customerPhone || null,
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
        modifiedBy: systemUserId,
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
  const systemUserId = await getOrCreateSystemUser();

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus }
    });

    await tx.auditLog.create({
      data: {
        ticketId,
        modifiedBy: systemUserId,
        action: 'Status changed',
        oldValue: oldStatus,
        newValue: newStatus
      }
    });
  });
}

import { UserRole } from '@prisma/client';

export async function createUser(formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as UserRole;

  const user = await prisma.userProfile.create({
    data: {
      fullName,
      email,
      role: role || 'Employee'
    }
  });

  return user;
}

export async function updateUser(userId: string, formData: FormData) {
  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as UserRole;

  const user = await prisma.userProfile.update({
    where: { id: userId },
    data: {
      fullName,
      email,
      role
    }
  });

  return user;
}

export async function updateTicketInfo(ticketId: string, formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const panelType = formData.get('panelType') as string;
  const priority = formData.get('priority') as TicketPriority;
  const specialNotes = formData.get('specialNotes') as string;
  const assignedTo = formData.get('assignedTo') as string;

  const systemUserId = await getOrCreateSystemUser();

  const ticket = await prisma.$transaction(async (tx) => {
    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: {
        customerName,
        customerPhone: customerPhone || null,
        panelType,
        priority,
        specialNotes: specialNotes || null,
        assignedTo: assignedTo || null,
      }
    });

    await tx.auditLog.create({
      data: {
        ticketId: ticketId,
        modifiedBy: systemUserId,
        action: 'Ticket Details Updated',
        oldValue: null,
        newValue: null
      }
    });

    return updatedTicket;
  });

  return ticket;
}
