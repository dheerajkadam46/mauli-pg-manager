import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import { Modal } from '../components/common/Modal';
import {
  Receipt,
  IndianRupee,
  Search,
  Filter,
  DollarSign,
  Printer,
  Calendar,
  Send,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageCircle,
} from 'lucide-react';

export const BillsPage: React.FC = () => {
  const {
    bills,
    selectedMonth,
    setSelectedMonth,
    setIsRecordPaymentOpen,
    setSelectedBillId,
    setSelectedReceiptBill,
    searchQuery,
    setSearchQuery,
  } = usePG();

  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partially_paid' | 'unpaid' | 'overdue'>('all');
  const [reminderBill, setReminderBill] = useState<typeof bills[0] | null>(null);
  const [reminderCopied, setReminderCopied] = useState(false);

  // Month options
  const availableMonths = ['October 2026', 'September 2026', 'August 2026'];

  // Current month bills
  const currentMonthBills = bills.filter((b) => b.monthYear === selectedMonth);

  const totalBilled = currentMonthBills.reduce((acc, b) => acc + b.billAmount, 0);
  const totalCollected = currentMonthBills.reduce((acc, b) => acc + b.amountPaid, 0);
  const totalOutstanding = currentMonthBills.reduce((acc, b) => acc + b.outstandingAmount, 0);

  const paidCount = currentMonthBills.filter((b) => b.status === 'paid').length;
  const partiallyPaidCount = currentMonthBills.filter((b) => b.status === 'partially_paid').length;
  const unpaidCount = currentMonthBills.filter((b) => b.status === 'unpaid').length;
  const overdueCount = currentMonthBills.filter((b) => b.status === 'overdue').length;

  // Filter bills
  const filteredBills = currentMonthBills.filter((bill) => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'unpaid' && bill.status !== 'unpaid' && bill.status !== 'overdue') return false;
      if (statusFilter !== 'unpaid' && bill.status !== statusFilter) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = bill.tenantName.toLowerCase().includes(q);
      const matchRoom = bill.roomNumber.includes(q);
      const matchBed = bill.bedId.toLowerCase().includes(q);
      if (!matchName && !matchRoom && !matchBed) return false;
    }

    return true;
  });

  const getReminderMessage = (bill: typeof bills[0]) => {
    return `Namaste ${bill.tenantName},\n\nThis is a gentle reminder regarding your monthly rent bill for Mauli PG (Room ${bill.roomNumber}, ${bill.bedId}) for ${bill.monthYear}.\n\nTotal Bill: ₹${bill.billAmount.toLocaleString('en-IN')}\nAmount Paid: ₹${bill.amountPaid.toLocaleString('en-IN')}\nOutstanding Due: ₹${bill.outstandingAmount.toLocaleString('en-IN')}\nDue Date: ${bill.dueDate}\n\nPlease transfer via UPI or visit the PG office at your earliest convenience.\n\nThank you,\nMauli PG Management`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
            Rent & Billing Ledger
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Monthly rent generation, partial payment tracking, and print-ready receipts.
          </p>
        </div>

        {/* Month Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} color="var(--color-primary)" />
          <select
            className="form-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ fontWeight: 600, width: '160px', padding: '7px 12px' }}
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '13px' }}
          >
            <DollarSign size={15} />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Total Billed ({selectedMonth})</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>
            ₹{totalBilled.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {currentMonthBills.length} Tenant Invoices
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Total Realized & Collected</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-success)', marginTop: '4px' }}>
            ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-success)', marginTop: '4px' }}>
            {paidCount} fully paid bills
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Outstanding Balance Due</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-accent)', marginTop: '4px' }}>
            ₹{totalOutstanding.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-accent)', marginTop: '4px' }}>
            {partiallyPaidCount} partial, {unpaidCount + overdueCount} unpaid
          </div>
        </div>

        <div className="card" style={{ padding: '16px' }}>
          <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>Collection Realization Rate</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '4px' }}>
            {totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0}%
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            {overdueCount > 0 ? `${overdueCount} Overdue Bills` : 'No overdue accounts'}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="filter-tabs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          >
            All Bills ({currentMonthBills.length})
          </button>
          <button
            onClick={() => setStatusFilter('paid')}
            className={`filter-tab ${statusFilter === 'paid' ? 'active' : ''}`}
          >
            Paid ({paidCount})
          </button>
          <button
            onClick={() => setStatusFilter('partially_paid')}
            className={`filter-tab ${statusFilter === 'partially_paid' ? 'active' : ''}`}
          >
            Partially Paid ({partiallyPaidCount})
          </button>
          <button
            onClick={() => setStatusFilter('unpaid')}
            className={`filter-tab ${statusFilter === 'unpaid' ? 'active' : ''}`}
          >
            Unpaid / Overdue ({unpaidCount + overdueCount})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search tenant or room..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', fontSize: '12.5px', padding: '7px 10px 7px 32px' }}
          />
        </div>
      </div>

      {/* Bills Ledger Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Room & Bed</th>
              <th>Billing Period</th>
              <th>Bill Amount</th>
              <th>Amount Paid</th>
              <th>Outstanding Balance</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No bills found matching the selected filter for {selectedMonth}.
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                      {bill.tenantName}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600 }}>Room {bill.roomNumber}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{bill.bedId}</div>
                  </td>

                  <td style={{ fontSize: '12.5px' }}>{bill.monthYear}</td>

                  <td>
                    <strong>₹{bill.billAmount.toLocaleString('en-IN')}</strong>
                  </td>

                  <td>
                    <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                      ₹{bill.amountPaid.toLocaleString('en-IN')}
                    </span>
                    {bill.payments.length > 0 && (
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {bill.payments.length} payment(s)
                      </div>
                    )}
                  </td>

                  <td>
                    <strong style={{ color: bill.outstandingAmount > 0 ? 'var(--color-accent)' : 'inherit' }}>
                      ₹{bill.outstandingAmount.toLocaleString('en-IN')}
                    </strong>
                  </td>

                  <td style={{ fontSize: '12.5px' }}>{bill.dueDate}</td>

                  <td>
                    <Badge type="bill" status={bill.status} />
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {bill.outstandingAmount > 0 && (
                        <button
                          onClick={() => {
                            setSelectedBillId(bill.id);
                            setIsRecordPaymentOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11.5px' }}
                        >
                          <DollarSign size={13} />
                          <span>Pay</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedReceiptBill(bill)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '4px 8px', fontSize: '11.5px' }}
                        title="Print Receipt"
                      >
                        <Receipt size={13} />
                        <span>Receipt</span>
                      </button>

                      {bill.outstandingAmount > 0 && (
                        <button
                          onClick={() => setReminderBill(bill)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '11.5px', color: 'var(--color-accent)' }}
                          title="Simulate WhatsApp / SMS Reminder"
                        >
                          <MessageCircle size={13} />
                          <span>Reminder</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Reminder Simulator Modal */}
      {reminderBill && (
        <Modal
          isOpen={!!reminderBill}
          onClose={() => {
            setReminderBill(null);
            setReminderCopied(false);
          }}
          title="Payment Reminder Simulator"
          subtitle={`Simulate WhatsApp / SMS rent reminder for ${reminderBill.tenantName}`}
          maxWidth="520px"
          footer={
            <>
              <button
                onClick={() => {
                  setReminderBill(null);
                  setReminderCopied(false);
                }}
                className="btn btn-outline btn-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(getReminderMessage(reminderBill));
                  setReminderCopied(true);
                  setTimeout(() => setReminderCopied(false), 2000);
                }}
                className="btn btn-primary btn-sm"
              >
                {reminderCopied ? 'Copied Message!' : 'Copy WhatsApp Text'}
              </button>
            </>
          }
        >
          <div>
            <div
              style={{
                padding: '14px',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '12px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                color: '#166534',
              }}
            >
              {getReminderMessage(reminderBill)}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '10px' }}>
              * In the production app, clicking Send will integrate directly with WhatsApp Cloud API to send automated WhatsApp reminders with UPI payment links.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
