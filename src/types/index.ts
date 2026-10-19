export const TYPES_VERSION = '1.0.0';

export type BedStatus = 'occupied' | 'available' | 'reserved' | 'notice' | 'maintenance';

export type TenancyStatus = 'active' | 'notice' | 'upcoming_checkout' | 'awaiting_settlement' | 'checked_out';

export type BillStatus = 'paid' | 'partially_paid' | 'unpaid' | 'overdue';

export type PaymentMethod = 'UPI' | 'Cash' | 'Bank Transfer';

export interface Bed {
  id: string; // e.g. "101-A"
  bedLabel: string; // "Bed A"
  roomId: string;
  roomNumber: string;
  floor: number;
  status: BedStatus;
  currentTenantId?: string;
  maintenanceReason?: string;
}

export interface Room {
  id: string; // "room-101"
  roomNumber: string; // "101"
  floor: number;
  type: 'single' | 'double' | 'triple';
  hasAttachedBath: boolean;
  hasAC: boolean;
  beds: Bed[];
  baseMonthlyRent: number;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email?: string;
  emergencyContact?: string;
  joiningDate: string; // YYYY-MM-DD
  floor: number;
  roomNumber: string;
  bedId: string;
  monthlyRent: number;
  securityDepositExpected: number;
  securityDepositReceived: number;
  status: TenancyStatus;
  noticeDate?: string; // YYYY-MM-DD
  intendedDepartureDate?: string; // YYYY-MM-DD
  actualCheckoutDate?: string;
  bedReleaseDate?: string;
  idProofType?: string;
  notes?: string;
  workOrCollege?: string;
}

export interface PaymentRecord {
  id: string;
  billId: string;
  tenantId: string;
  tenantName: string;
  date: string; // YYYY-MM-DD
  amount: number;
  method: PaymentMethod;
  referenceNo?: string;
  note?: string;
}

export interface Bill {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedId: string;
  monthYear: string; // "October 2026"
  billAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  dueDate: string; // YYYY-MM-DD
  status: BillStatus;
  payments: PaymentRecord[];
}

export interface DeductionItem {
  id: string;
  reason: string;
  amount: number;
}

export interface DepositRecord {
  id: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  bedId: string;
  expectedAmount: number;
  receivedAmount: number;
  deductionAmount: number;
  deductionsBreakdown: DeductionItem[];
  refundDue: number;
  refundPaid: number;
  settlementDate?: string;
  settlementStatus: 'held' | 'awaiting_settlement' | 'refunded' | 'settled';
  refundMethod?: PaymentMethod;
  refundRefNo?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  category: 'payment' | 'tenant' | 'room' | 'checkout' | 'system';
  tenantName?: string;
}

export interface PropertySettings {
  name: string;
  subtitle: string;
  branch: string;
  address: string;
  contactPhone: string;
  whatsapp: string;
  email: string;
  ownerName: string;
  defaultRent: number;
  defaultDeposit: number;
  maintenanceDeduction: number;
  noticeDays: number;
  rentDueDay: number;
  mealsIncluded: boolean;
  biometricConnected: boolean;
  biometricDeviceName: string;
}

export interface ClientFeedback {
  id: string;
  timestamp: string;
  author: string;
  comment: string;
  category: 'feature' | 'customization' | 'pricing' | 'general';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  actionRoute?: string;
}
