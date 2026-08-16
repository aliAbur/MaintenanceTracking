import { Ticket, AuditLog } from '../types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    customerPhone: '555-0100',
    panelType: 'Interactive Display Pro',
    priority: 'High',
    specialNotes: 'Screen flickering intermittently',
    assignedTo: 'user-1',
    status: 'Open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    assignee: {
      id: 'user-1',
      email: 'tech1@example.com',
      fullName: 'John Doe',
      role: 'Employee',
      createdAt: new Date().toISOString()
    }
  },
  {
    id: '2',
    customerName: 'Bob Smith',
    customerPhone: '555-0200',
    panelType: 'Standard Panel V2',
    priority: 'Low',
    specialNotes: 'Needs routine calibration check',
    assignedTo: 'user-2',
    status: 'Processing',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignee: {
      id: 'user-2',
      email: 'tech2@example.com',
      fullName: 'Jane Smith',
      role: 'Employee',
      createdAt: new Date().toISOString()
    }
  }
];

export const MOCK_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    ticketId: '1',
    modifiedBy: 'user-1',
    action: 'Ticket Created',
    oldValue: null,
    newValue: 'Open',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    modifier: {
      id: 'user-1',
      email: 'tech1@example.com',
      fullName: 'John Doe',
      role: 'Employee',
      createdAt: new Date().toISOString()
    }
  }
];
