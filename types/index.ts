export type TicketStatus = 'Open' | 'Processing' | 'OnHold' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type UserRole = 'Admin' | 'Employee' | 'Observer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: UserRole;
  createdAt: string | Date;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerPhone: string | null;
  panelType: string;
  priority: TicketPriority;
  specialNotes: string | null;
  assignedTo: string | null;
  status: TicketStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
  assignee?: UserProfile | null;
}

export interface AuditLog {
  id: string;
  ticketId: string;
  modifiedBy: string;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string | Date;
  modifier?: UserProfile | null;
}
