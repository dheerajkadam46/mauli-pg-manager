import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Room,
  Tenant,
  Bill,
  DepositRecord,
  ActivityLog,
  PropertySettings,
  NotificationItem,
  ClientFeedback,
  BedStatus,
  PaymentMethod,
  DeductionItem,
} from '../types';
import {
  initialPropertySettings,
  initialRooms,
  initialTenants,
  initialBills,
  initialDeposits,
  initialActivityLogs,
  initialNotifications,
} from '../data/seedData';

interface PGContextType {
  // Navigation & UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;

  // Modals & Panels
  isAddTenantOpen: boolean;
  setIsAddTenantOpen: (open: boolean) => void;
  isRecordPaymentOpen: boolean;
  setIsRecordPaymentOpen: (open: boolean) => void;
  isCheckoutWizardOpen: boolean;
  setIsCheckoutWizardOpen: (open: boolean) => void;
  isFeedbackOpen: boolean;
  setIsFeedbackOpen: (open: boolean) => void;
  isQuickTourOpen: boolean;
  setIsQuickTourOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Selected item targets for modals
  selectedTenantId: string | null;
  setSelectedTenantId: (id: string | null) => void;
  selectedBillId: string | null;
  setSelectedBillId: (id: string | null) => void;
  selectedBedId: string | null;
  setSelectedBedId: (id: string | null) => void;
  selectedReceiptBill: Bill | null;
  setSelectedReceiptBill: (bill: Bill | null) => void;

  // Core Data
  settings: PropertySettings;
  updateSettings: (newSettings: Partial<PropertySettings>) => void;
  rooms: Room[];
  tenants: Tenant[];
  bills: Bill[];
  deposits: DepositRecord[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  clientFeedbacks: ClientFeedback[];

  // Metrics
  metrics: {
    activeTenantsCount: number;
    totalRoomsCount: number;
    totalBedsCount: number;
    occupiedBedsCount: number;
    availableBedsCount: number;
    reservedBedsCount: number;
    noticeBedsCount: number;
    maintenanceBedsCount: number;
    occupancyRate: number;
    billedThisMonth: number;
    collectedThisMonth: number;
    outstandingThisMonth: number;
    upcomingMoveOutsCount: number;
    totalDepositsExpected: number;
    totalDepositsReceived: number;
    depositsAwaitingSettlement: number;
    refundsDueAmount: number;
    refundsCompletedAmount: number;
  };

  // Actions
  addTenant: (params: {
    name: string;
    phone: string;
    email?: string;
    emergencyContact?: string;
    joiningDate: string;
    floor: number;
    roomNumber: string;
    bedId: string;
    monthlyRent: number;
    securityDeposit: number;
    initialRentReceived: number;
    initialDepositReceived: number;
    paymentMethod: PaymentMethod;
    workOrCollege?: string;
    notes?: string;
  }) => { success: boolean; message: string };

  updateTenant: (id: string, data: Partial<Tenant>) => void;
  assignBedToTenant: (bedId: string, tenantId: string) => { success: boolean; message: string };
  transferTenantBed: (tenantId: string, targetBedId: string) => { success: boolean; message: string };
  updateBedStatus: (bedId: string, newStatus: BedStatus, reason?: string) => void;

  recordPayment: (params: {
    billId: string;
    amount: number;
    method: PaymentMethod;
    referenceNo?: string;
    note?: string;
  }) => { success: boolean; message: string };

  submitNotice: (tenantId: string, noticeDate: string, departureDate: string) => { success: boolean; message: string };

  checkoutTenant: (params: {
    tenantId: string;
    deductions: DeductionItem[];
    refundPaid: number;
    refundMethod: PaymentMethod;
    refundRefNo?: string;
    markBedAs: 'available' | 'maintenance';
  }) => { success: boolean; message: string };

  recordDepositRefund: (params: {
    depositId: string;
    refundPaid: number;
    refundMethod: PaymentMethod;
    refundRefNo?: string;
  }) => void;

  addFeedback: (author: string, comment: string, category: ClientFeedback['category']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;

  // Helpers
  getBedById: (bedId: string) => { bed: Room['beds'][0]; room: Room } | null;
  getTenantById: (tenantId: string) => Tenant | undefined;
  getTenantCurrentBill: (tenantId: string) => Bill | undefined;
  getTenantDeposit: (tenantId: string) => DepositRecord | undefined;
}

const PGContext = createContext<PGContextType | undefined>(undefined);

const STORAGE_KEY = 'mauli_pg_manager_demo_v1';

export const PGProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & View state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('October 2026');

  // Modals state
  const [isAddTenantOpen, setIsAddTenantOpen] = useState<boolean>(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState<boolean>(false);
  const [isCheckoutWizardOpen, setIsCheckoutWizardOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isQuickTourOpen, setIsQuickTourOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Selected item targets
  const [selectedTenantId, setSelectedTenantId] = useState<string | null>(null);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);
  const [selectedBedId, setSelectedBedId] = useState<string | null>(null);
  const [selectedReceiptBill, setSelectedReceiptBill] = useState<Bill | null>(null);

  // Data states initialized from LocalStorage or seedData
  const [settings, setSettings] = useState<PropertySettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : initialPropertySettings;
    } catch {
      return initialPropertySettings;
    }
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
      return saved ? JSON.parse(saved) : initialRooms;
    } catch {
      return initialRooms;
    }
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tenants`);
      return saved ? JSON.parse(saved) : initialTenants;
    } catch {
      return initialTenants;
    }
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_bills`);
      return saved ? JSON.parse(saved) : initialBills;
    } catch {
      return initialBills;
    }
  });

  const [deposits, setDeposits] = useState<DepositRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_deposits`);
      return saved ? JSON.parse(saved) : initialDeposits;
    } catch {
      return initialDeposits;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : initialActivityLogs;
    } catch {
      return initialActivityLogs;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_notifs`);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [clientFeedbacks, setClientFeedbacks] = useState<ClientFeedback[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_feedbacks`);
      return saved ? JSON.parse(saved) : [
        {
          id: 'fb-1',
          timestamp: '2026-10-15 10:20 AM',
          author: 'Demo Client Review',
          comment: 'Can we add an option to capture meal preferences (Veg/Non-veg) for the mess menu?',
          category: 'feature',
        },
      ];
    } catch {
      return [];
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
      localStorage.setItem(`${STORAGE_KEY}_tenants`, JSON.stringify(tenants));
      localStorage.setItem(`${STORAGE_KEY}_bills`, JSON.stringify(bills));
      localStorage.setItem(`${STORAGE_KEY}_deposits`, JSON.stringify(deposits));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activityLogs));
      localStorage.setItem(`${STORAGE_KEY}_notifs`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_feedbacks`, JSON.stringify(clientFeedbacks));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [settings, rooms, tenants, bills, deposits, activityLogs, notifications, clientFeedbacks]);

  // Derived metrics calculations
  const allBeds = rooms.flatMap((r) => r.beds);
  const totalBedsCount = allBeds.length;
  const totalRoomsCount = rooms.length;
  const occupiedBedsCount = allBeds.filter((b) => b.status === 'occupied').length;
  const availableBedsCount = allBeds.filter((b) => b.status === 'available').length;
  const reservedBedsCount = allBeds.filter((b) => b.status === 'reserved').length;
  const noticeBedsCount = allBeds.filter((b) => b.status === 'notice').length;
  const maintenanceBedsCount = allBeds.filter((b) => b.status === 'maintenance').length;
  const activeTenantsCount = tenants.filter(
    (t) => t.status === 'active' || t.status === 'notice' || t.status === 'upcoming_checkout'
  ).length;
  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

  const currentMonthBills = bills.filter((b) => b.monthYear === selectedMonth);
  const billedThisMonth = currentMonthBills.reduce((acc, b) => acc + b.billAmount, 0);
  const collectedThisMonth = currentMonthBills.reduce((acc, b) => acc + b.amountPaid, 0);
  const outstandingThisMonth = currentMonthBills.reduce((acc, b) => acc + b.outstandingAmount, 0);

  const upcomingMoveOutsCount = tenants.filter(
    (t) => t.status === 'notice' || t.status === 'upcoming_checkout'
  ).length;

  const totalDepositsExpected = deposits.reduce((acc, d) => acc + d.expectedAmount, 0);
  const totalDepositsReceived = deposits.reduce((acc, d) => acc + d.receivedAmount, 0);
  const depositsAwaitingSettlement = deposits.filter((d) => d.settlementStatus === 'awaiting_settlement').length;
  const refundsDueAmount = deposits
    .filter((d) => d.settlementStatus === 'awaiting_settlement' || d.settlementStatus === 'held')
    .reduce((acc, d) => acc + d.refundDue, 0);
  const refundsCompletedAmount = deposits
    .filter((d) => d.settlementStatus === 'refunded')
    .reduce((acc, d) => acc + d.refundPaid, 0);

  const metrics = {
    activeTenantsCount,
    totalRoomsCount,
    totalBedsCount,
    occupiedBedsCount,
    availableBedsCount,
    reservedBedsCount,
    noticeBedsCount,
    maintenanceBedsCount,
    occupancyRate,
    billedThisMonth,
    collectedThisMonth,
    outstandingThisMonth,
    upcomingMoveOutsCount,
    totalDepositsExpected,
    totalDepositsReceived,
    depositsAwaitingSettlement,
    refundsDueAmount,
    refundsCompletedAmount,
  };

  // Helpers
  const getBedById = (bedId: string) => {
    for (const room of rooms) {
      const found = room.beds.find((b) => b.id === bedId);
      if (found) return { bed: found, room };
    }
    return null;
  };

  const getTenantById = (tenantId: string) => tenants.find((t) => t.id === tenantId);

  const getTenantCurrentBill = (tenantId: string) =>
    bills.find((b) => b.tenantId === tenantId && b.monthYear === selectedMonth);

  const getTenantDeposit = (tenantId: string) => deposits.find((d) => d.tenantId === tenantId);

  // Core Actions
  const addTenant: PGContextType['addTenant'] = (params) => {
    // 1. Validate bed availability
    const bedInfo = getBedById(params.bedId);
    if (!bedInfo) {
      return { success: false, message: `Bed ${params.bedId} not found.` };
    }
    if (bedInfo.bed.status !== 'available' && bedInfo.bed.status !== 'reserved') {
      return { success: false, message: `Bed ${params.bedId} is currently ${bedInfo.bed.status} and cannot be assigned.` };
    }

    const newTenantId = `t-${Date.now()}`;
    const newTenant: Tenant = {
      id: newTenantId,
      name: params.name.trim(),
      phone: params.phone.trim(),
      email: params.email?.trim(),
      emergencyContact: params.emergencyContact?.trim(),
      joiningDate: params.joiningDate,
      floor: params.floor,
      roomNumber: params.roomNumber,
      bedId: params.bedId,
      monthlyRent: params.monthlyRent,
      securityDepositExpected: params.securityDeposit,
      securityDepositReceived: params.initialDepositReceived,
      status: 'active',
      workOrCollege: params.workOrCollege?.trim(),
      notes: params.notes?.trim(),
    };

    // 2. Mark bed as occupied
    setRooms((prevRooms) =>
      prevRooms.map((r) => ({
        ...r,
        beds: r.beds.map((b) =>
          b.id === params.bedId
            ? { ...b, status: 'occupied' as BedStatus, currentTenantId: newTenantId }
            : b
        ),
      }))
    );

    // 3. Add tenant to state
    setTenants((prev) => [newTenant, ...prev]);

    // 4. Create initial rent bill for current month
    const newBillId = `bill-${Date.now()}`;
    const initialPaymentRecords: Bill['payments'] = [];
    if (params.initialRentReceived > 0) {
      initialPaymentRecords.push({
        id: `pay-${Date.now()}`,
        billId: newBillId,
        tenantId: newTenantId,
        tenantName: params.name,
        date: params.joiningDate,
        amount: params.initialRentReceived,
        method: params.paymentMethod,
        referenceNo: `INITIAL-PAY-${Date.now().toString().slice(-6)}`,
        note: 'Move-in initial rent payment',
      });
    }

    const billStatus: Bill['status'] =
      params.initialRentReceived >= params.monthlyRent
        ? 'paid'
        : params.initialRentReceived > 0
        ? 'partially_paid'
        : 'unpaid';

    const newBill: Bill = {
      id: newBillId,
      tenantId: newTenantId,
      tenantName: params.name,
      roomNumber: params.roomNumber,
      bedId: params.bedId,
      monthYear: selectedMonth,
      billAmount: params.monthlyRent,
      amountPaid: params.initialRentReceived,
      outstandingAmount: Math.max(0, params.monthlyRent - params.initialRentReceived),
      dueDate: `${params.joiningDate.slice(0, 7)}-${String(settings.rentDueDay).padStart(2, '0')}`,
      status: billStatus,
      payments: initialPaymentRecords,
    };

    setBills((prev) => [newBill, ...prev]);

    // 5. Create deposit record
    const newDeposit: DepositRecord = {
      id: `dep-${Date.now()}`,
      tenantId: newTenantId,
      tenantName: params.name,
      roomNumber: params.roomNumber,
      bedId: params.bedId,
      expectedAmount: params.securityDeposit,
      receivedAmount: params.initialDepositReceived,
      deductionAmount: 0,
      deductionsBreakdown: [],
      refundDue: 0,
      refundPaid: 0,
      settlementStatus: 'held',
    };

    setDeposits((prev) => [newDeposit, ...prev]);

    // 6. Log activity
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: formattedDate,
      title: 'New Tenant Joined',
      description: `${params.name} assigned to Room ${params.roomNumber}, ${bedInfo.bed.bedLabel}. Initial Rent: ₹${params.initialRentReceived}, Deposit: ₹${params.initialDepositReceived}.`,
      category: 'tenant',
      tenantName: params.name,
    };
    setActivityLogs((prev) => [newActivity, ...prev]);

    return { success: true, message: `Tenant ${params.name} added successfully and assigned to ${bedInfo.bed.bedLabel}!` };
  };

  const updateTenant = (id: string, data: Partial<Tenant>) => {
    setTenants((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...data };
        }
        return t;
      })
    );
  };

  const assignBedToTenant = (bedId: string, tenantId: string) => {
    const bedInfo = getBedById(bedId);
    const tenant = getTenantById(tenantId);
    if (!bedInfo || !tenant) {
      return { success: false, message: 'Bed or Tenant not found.' };
    }
    if (bedInfo.bed.status !== 'available' && bedInfo.bed.status !== 'reserved') {
      return { success: false, message: `Bed ${bedId} is ${bedInfo.bed.status}.` };
    }

    // Free previous bed if tenant had one
    if (tenant.bedId && tenant.bedId !== bedId) {
      setRooms((prev) =>
        prev.map((r) => ({
          ...r,
          beds: r.beds.map((b) =>
            b.id === tenant.bedId ? { ...b, status: 'available' as BedStatus, currentTenantId: undefined } : b
          ),
        }))
      );
    }

    // Assign new bed
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        beds: r.beds.map((b) =>
          b.id === bedId ? { ...b, status: 'occupied' as BedStatus, currentTenantId: tenantId } : b
        ),
      }))
    );

    updateTenant(tenantId, {
      bedId,
      roomNumber: bedInfo.room.roomNumber,
      floor: bedInfo.room.floor,
    });

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: formattedDate,
        title: 'Bed Assigned',
        description: `${tenant.name} assigned to Room ${bedInfo.room.roomNumber}, ${bedInfo.bed.bedLabel}.`,
        category: 'room',
        tenantName: tenant.name,
      },
      ...prev,
    ]);

    return { success: true, message: `Bed assigned to ${tenant.name}.` };
  };

  const transferTenantBed = (tenantId: string, targetBedId: string) => {
    const tenant = getTenantById(tenantId);
    const targetBedInfo = getBedById(targetBedId);
    if (!tenant || !targetBedInfo) {
      return { success: false, message: 'Tenant or target bed not found.' };
    }
    if (targetBedInfo.bed.status !== 'available') {
      return { success: false, message: `Target Bed ${targetBedId} is not available.` };
    }

    const oldBedId = tenant.bedId;
    const oldRoomNo = tenant.roomNumber;

    // Free old bed, occupy new bed
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        beds: r.beds.map((b) => {
          if (b.id === oldBedId) {
            return { ...b, status: 'available' as BedStatus, currentTenantId: undefined };
          }
          if (b.id === targetBedId) {
            return { ...b, status: 'occupied' as BedStatus, currentTenantId: tenantId };
          }
          return b;
        }),
      }))
    );

    // Update tenant
    updateTenant(tenantId, {
      bedId: targetBedId,
      roomNumber: targetBedInfo.room.roomNumber,
      floor: targetBedInfo.room.floor,
    });

    // Update bills and deposits with new room & bed
    setBills((prev) =>
      prev.map((b) =>
        b.tenantId === tenantId ? { ...b, roomNumber: targetBedInfo.room.roomNumber, bedId: targetBedId } : b
      )
    );
    setDeposits((prev) =>
      prev.map((d) =>
        d.tenantId === tenantId ? { ...d, roomNumber: targetBedInfo.room.roomNumber, bedId: targetBedId } : d
      )
    );

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: formattedDate,
        title: 'Bed Transfer Completed',
        description: `Transferred ${tenant.name} from Room ${oldRoomNo} (${oldBedId}) to Room ${targetBedInfo.room.roomNumber} (${targetBedId}).`,
        category: 'room',
        tenantName: tenant.name,
      },
      ...prev,
    ]);

    return { success: true, message: `Successfully shifted ${tenant.name} to Room ${targetBedInfo.room.roomNumber} (${targetBedInfo.bed.bedLabel}).` };
  };

  const updateBedStatus = (bedId: string, newStatus: BedStatus, reason?: string) => {
    setRooms((prev) =>
      prev.map((r) => ({
        ...r,
        beds: r.beds.map((b) => {
          if (b.id === bedId) {
            return {
              ...b,
              status: newStatus,
              maintenanceReason: newStatus === 'maintenance' ? reason || 'Routine maintenance' : undefined,
              currentTenantId: newStatus === 'available' || newStatus === 'maintenance' ? undefined : b.currentTenantId,
            };
          }
          return b;
        }),
      }))
    );
  };

  const recordPayment: PGContextType['recordPayment'] = (params) => {
    const bill = bills.find((b) => b.id === params.billId);
    if (!bill) {
      return { success: false, message: 'Bill not found.' };
    }
    if (params.amount <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }

    const newPayment: Bill['payments'][0] = {
      id: `pay-${Date.now()}`,
      billId: bill.id,
      tenantId: bill.tenantId,
      tenantName: bill.tenantName,
      date: new Date().toISOString().split('T')[0],
      amount: params.amount,
      method: params.method,
      referenceNo: params.referenceNo || `SIM-${Date.now().toString().slice(-6)}`,
      note: params.note,
    };

    const newAmountPaid = bill.amountPaid + params.amount;
    const newOutstanding = Math.max(0, bill.billAmount - newAmountPaid);
    const newStatus: Bill['status'] = newOutstanding === 0 ? 'paid' : 'partially_paid';

    setBills((prev) =>
      prev.map((b) =>
        b.id === params.billId
          ? {
              ...b,
              amountPaid: newAmountPaid,
              outstandingAmount: newOutstanding,
              status: newStatus,
              payments: [...b.payments, newPayment],
            }
          : b
      )
    );

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: formattedDate,
        title: 'Payment Recorded',
        description: `Recorded ₹${params.amount.toLocaleString('en-IN')} via ${params.method} for ${bill.tenantName} (${bill.monthYear}). New balance: ₹${newOutstanding.toLocaleString('en-IN')}.`,
        category: 'payment',
        tenantName: bill.tenantName,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Payment of ₹${params.amount.toLocaleString('en-IN')} recorded for ${bill.tenantName}. Status updated to ${newStatus.replace('_', ' ').toUpperCase()}.`,
    };
  };

  const submitNotice = (tenantId: string, noticeDate: string, departureDate: string) => {
    const tenant = getTenantById(tenantId);
    if (!tenant) return { success: false, message: 'Tenant not found.' };

    updateTenant(tenantId, {
      status: 'notice',
      noticeDate,
      intendedDepartureDate: departureDate,
    });

    // Mark bed as notice
    if (tenant.bedId) {
      setRooms((prev) =>
        prev.map((r) => ({
          ...r,
          beds: r.beds.map((b) => (b.id === tenant.bedId ? { ...b, status: 'notice' as BedStatus } : b)),
        }))
      );
    }

    // Update deposit record to awaiting_settlement
    setDeposits((prev) =>
      prev.map((d) => {
        if (d.tenantId === tenantId) {
          const standardDeduction = settings.maintenanceDeduction;
          const refundDue = Math.max(0, d.receivedAmount - standardDeduction);
          return {
            ...d,
            settlementStatus: 'awaiting_settlement',
            deductionAmount: standardDeduction,
            deductionsBreakdown: [
              { id: `ded-${Date.now()}`, reason: 'Standard Maintenance & Painting Deduction', amount: standardDeduction },
            ],
            refundDue,
          };
        }
        return d;
      })
    );

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: formattedDate,
        title: 'Notice Submitted',
        description: `${tenant.name} (Room ${tenant.roomNumber}) submitted notice on ${noticeDate}. Departure scheduled for ${departureDate}.`,
        category: 'tenant',
        tenantName: tenant.name,
      },
      ...prev,
    ]);

    return { success: true, message: `15-day notice submitted for ${tenant.name}. Move-out scheduled for ${departureDate}.` };
  };

  const checkoutTenant: PGContextType['checkoutTenant'] = (params) => {
    const tenant = getTenantById(params.tenantId);
    if (!tenant) return { success: false, message: 'Tenant not found.' };

    const today = new Date().toISOString().split('T')[0];
    const totalDeductions = params.deductions.reduce((sum, d) => sum + d.amount, 0);

    // 1. Update tenant status to checked_out
    updateTenant(params.tenantId, {
      status: 'checked_out',
      actualCheckoutDate: today,
      bedReleaseDate: today,
    });

    // 2. Release or set maintenance on the bed
    if (tenant.bedId) {
      setRooms((prev) =>
        prev.map((r) => ({
          ...r,
          beds: r.beds.map((b) => {
            if (b.id === tenant.bedId) {
              return {
                ...b,
                status: params.markBedAs === 'available' ? 'available' : 'maintenance',
                currentTenantId: undefined,
                maintenanceReason:
                  params.markBedAs === 'maintenance' ? 'Post-checkout deep cleaning & painting' : undefined,
              };
            }
            return b;
          }),
        }))
      );
    }

    // 3. Update deposit settlement
    setDeposits((prev) =>
      prev.map((d) => {
        if (d.tenantId === params.tenantId) {
          const refundDue = Math.max(0, d.receivedAmount - totalDeductions);
          return {
            ...d,
            deductionAmount: totalDeductions,
            deductionsBreakdown: params.deductions,
            refundDue,
            refundPaid: params.refundPaid,
            settlementDate: today,
            settlementStatus: 'refunded',
            refundMethod: params.refundMethod,
            refundRefNo: params.refundRefNo || `REF-${Date.now().toString().slice(-6)}`,
          };
        }
        return d;
      })
    );

    // 4. Log checkout activity
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: formattedDate,
        title: 'Checkout Completed',
        description: `Completed checkout for ${tenant.name}. Total Deductions: ₹${totalDeductions}, Refund Paid: ₹${params.refundPaid} via ${params.refundMethod}. Bed ${tenant.bedId} marked as ${params.markBedAs}.`,
        category: 'checkout',
        tenantName: tenant.name,
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Checkout completed for ${tenant.name}. Bed ${tenant.bedId} released as ${params.markBedAs}.`,
    };
  };

  const recordDepositRefund = (params: {
    depositId: string;
    refundPaid: number;
    refundMethod: PaymentMethod;
    refundRefNo?: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    setDeposits((prev) =>
      prev.map((d) => {
        if (d.id === params.depositId) {
          return {
            ...d,
            refundPaid: params.refundPaid,
            settlementStatus: 'refunded',
            settlementDate: today,
            refundMethod: params.refundMethod,
            refundRefNo: params.refundRefNo || `REF-${Date.now().toString().slice(-6)}`,
          };
        }
        return d;
      })
    );
  };

  const addFeedback = (author: string, comment: string, category: ClientFeedback['category']) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-GB')} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newFeedback: ClientFeedback = {
      id: `fb-${Date.now()}`,
      timestamp: formattedDate,
      author: author.trim() || 'Client',
      comment: comment.trim(),
      category,
    };
    setClientFeedbacks((prev) => [newFeedback, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const updateSettings = (newSettings: Partial<PropertySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
    localStorage.removeItem(`${STORAGE_KEY}_rooms`);
    localStorage.removeItem(`${STORAGE_KEY}_tenants`);
    localStorage.removeItem(`${STORAGE_KEY}_bills`);
    localStorage.removeItem(`${STORAGE_KEY}_deposits`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_notifs`);
    localStorage.removeItem(`${STORAGE_KEY}_feedbacks`);

    setSettings(initialPropertySettings);
    setRooms(initialRooms);
    setTenants(initialTenants);
    setBills(initialBills);
    setDeposits(initialDeposits);
    setActivityLogs(initialActivityLogs);
    setNotifications(initialNotifications);
    setClientFeedbacks([]);
  };

  return (
    <PGContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedMonth,
        setSelectedMonth,
        isAddTenantOpen,
        setIsAddTenantOpen,
        isRecordPaymentOpen,
        setIsRecordPaymentOpen,
        isCheckoutWizardOpen,
        setIsCheckoutWizardOpen,
        isFeedbackOpen,
        setIsFeedbackOpen,
        isQuickTourOpen,
        setIsQuickTourOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        selectedTenantId,
        setSelectedTenantId,
        selectedBillId,
        setSelectedBillId,
        selectedBedId,
        setSelectedBedId,
        selectedReceiptBill,
        setSelectedReceiptBill,
        settings,
        updateSettings,
        rooms,
        tenants,
        bills,
        deposits,
        activityLogs,
        notifications,
        clientFeedbacks,
        metrics,
        addTenant,
        updateTenant,
        assignBedToTenant,
        transferTenantBed,
        updateBedStatus,
        recordPayment,
        submitNotice,
        checkoutTenant,
        recordDepositRefund,
        addFeedback,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        getBedById,
        getTenantById,
        getTenantCurrentBill,
        getTenantDeposit,
      }}
    >
      {children}
    </PGContext.Provider>
  );
};

export const usePG = () => {
  const context = useContext(PGContext);
  if (!context) {
    throw new Error('usePG must be used within a PGProvider');
  }
  return context;
};
