'use server'

import { prisma } from './prisma';
import { TicketStatus, TicketPriority } from '@prisma/client';

export async function getOrCreateSystemUser() {
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
      createdAt: 'desc'
    }
  });

  return logs;
}

import { getSession } from './auth';

async function generateTicketId(tx: any) {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `NITM-${year}-${month}-`;

  const lastTicket = await tx.ticket.findFirst({
    where: { id: { startsWith: prefix } },
    orderBy: { id: 'desc' },
  });

  if (!lastTicket) {
    return `${prefix}001`;
  }

  const lastSequence = parseInt(lastTicket.id.replace(prefix, ''), 10);
  const nextSequence = lastSequence + 1;
  return `${prefix}${String(nextSequence).padStart(3, '0')}`;
}

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function createTicket(formData: FormData) {
  const customerName = formData.get('customerName') as string;
  const customerPhone = formData.get('customerPhone') as string;
  const panelType = formData.get('panelType') as string;
  const priority = formData.get('priority') as TicketPriority;
  const specialNotes = formData.get('specialNotes') as string;
  const assignedTo = formData.get('assignedTo') as string;
  const images = formData.getAll('images') as File[];

  const session = await getSession();
  const userId = session?.user?.id || await getOrCreateSystemUser();
  const role = session?.user?.role || 'Admin';

  if (role === 'Observer') {
    throw new Error('Observers are not allowed to create tickets.');
  }
  
  const imageUrls: string[] = [];
  if (images && images.length > 0) {
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    for (const image of images) {
      if (image && typeof image === 'object' && image.size > 0) {
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);
        imageUrls.push(`/uploads/${filename}`);
      }
    }
  }

  const ticket = await prisma.$transaction(async (tx) => {
    const newTicketId = await generateTicketId(tx);

    const newTicket = await tx.ticket.create({
      data: {
        id: newTicketId,
        customerName,
        customerPhone: customerPhone || null,
        panelType,
        priority,
        specialNotes: specialNotes || null,
        assignedTo: role === 'Admin' ? (assignedTo || null) : null,
        createdBy: userId,
        status: 'Open',
        images: imageUrls,
      }
    });

    await tx.auditLog.create({
      data: {
        ticketId: newTicket.id,
        modifiedBy: userId,
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
  const session = await getSession();
  const userId = session?.user?.id || await getOrCreateSystemUser();
  const role = session?.user?.role || 'Admin';

  if (role === 'Observer') {
    throw new Error('Observers cannot update ticket status.');
  }

  await prisma.$transaction(async (tx) => {
    await tx.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus }
    });

    await tx.auditLog.create({
      data: {
        ticketId,
        modifiedBy: userId,
        action: 'Status changed',
        oldValue: oldStatus,
        newValue: newStatus
      }
    });
  });
}

export async function deleteTicketAction(ticketId: string) {
  const session = await getSession();
  const role = session?.user?.role || 'Admin';

  if (role !== 'Admin') {
    throw new Error('Only Admins can delete tickets.');
  }

  await prisma.ticket.delete({
    where: { id: ticketId }
  });
}

import { UserRole } from '@prisma/client';

import bcrypt from 'bcryptjs';

export async function createUser(formData: FormData) {
  const session = await getSession();
  if (session?.user?.role !== 'Admin') throw new Error('Unauthorized');

  const fullName = formData.get('fullName') as string;
  const email = formData.get('email') as string;
  const role = formData.get('role') as UserRole;
  const password = formData.get('password') as string;

  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const user = await prisma.userProfile.create({
    data: {
      fullName,
      email,
      role: role || 'Employee',
      password: hashedPassword
    }
  });

  return user;
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getSession();
  if (session?.user?.role !== 'Admin') throw new Error('Unauthorized');

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

export async function deleteUser(userId: string) {
  const session = await getSession();
  if (session?.user?.role !== 'Admin') throw new Error('Unauthorized');

  const systemUserId = await getOrCreateSystemUser();

  // Re-assign all audit logs made by this user to the system user to preserve history
  await prisma.auditLog.updateMany({
    where: { modifiedBy: userId },
    data: { modifiedBy: systemUserId }
  });

  // Prisma takes care of setting Ticket assignedTo to null (ON DELETE SET NULL)
  const user = await prisma.userProfile.delete({
    where: { id: userId }
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

  const session = await getSession();
  const userId = session?.user?.id || await getOrCreateSystemUser();
  const role = session?.user?.role || 'Admin';

  const existingTicket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!existingTicket) throw new Error('Ticket not found');

  if (role === 'Observer') {
    throw new Error('Observers cannot edit tickets.');
  }

  const isOwner = existingTicket.createdBy === userId || existingTicket.assignedTo === userId;
  const canEditDetails = role === 'Admin' || (role === 'Employee' && isOwner);

  const ticket = await prisma.$transaction(async (tx) => {
    let updateData: any = {};
    
    const oldNotes = existingTicket.specialNotes || '';
    const newNotes = specialNotes || '';
    const notesChanged = oldNotes !== newNotes;
    
    let detailsChanged = false;

    if (canEditDetails) {
      const finalAssignedTo = role === 'Admin' ? (assignedTo || null) : existingTicket.assignedTo;
      if (
        existingTicket.customerName !== customerName ||
        (existingTicket.customerPhone || '') !== (customerPhone || '') ||
        existingTicket.panelType !== panelType ||
        existingTicket.priority !== priority ||
        (existingTicket.assignedTo || '') !== (finalAssignedTo || '')
      ) {
        detailsChanged = true;
      }
      
      updateData = {
        customerName,
        customerPhone: customerPhone || null,
        panelType,
        priority,
        assignedTo: finalAssignedTo,
      };
    }
    
    if (notesChanged) {
      updateData.specialNotes = specialNotes || null;
    }

    const images = formData.getAll('images') as File[];
    let newImageUrls: string[] = [];
    
    if (images && images.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      try { await mkdir(uploadDir, { recursive: true }); } catch (e) {}

      for (const image of images) {
        if (image && typeof image === 'object' && image.size > 0) {
          const bytes = await image.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const filename = `${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filepath = join(uploadDir, filename);
          await writeFile(filepath, buffer);
          newImageUrls.push(`/uploads/${filename}`);
        }
      }
    }
    
    if (newImageUrls.length > 0) {
      updateData.images = {
        push: newImageUrls
      };
    }

    const updatedTicket = await tx.ticket.update({
      where: { id: ticketId },
      data: updateData
    });

    if (detailsChanged) {
      await tx.auditLog.create({
        data: {
          ticketId: ticketId,
          modifiedBy: userId,
          action: 'Ticket Details Updated',
          oldValue: null,
          newValue: null
        }
      });
    }

    if (notesChanged) {
      await tx.auditLog.create({
        data: {
          ticketId: ticketId,
          modifiedBy: userId,
          action: 'Diagnostic Notes Updated',
          oldValue: null,
          newValue: specialNotes || null
        }
      });
    }

    return updatedTicket;
  });

  return ticket;
}
