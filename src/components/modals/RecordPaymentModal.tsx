import React, { useState, useEffect } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import type { PaymentMethod } from '../../types';
import { Check, Info, AlertCircle } from 'lucide-react';

export const RecordPaymentModal: React.FC = () => {
  const {
    isRecordPaymentOpen,
    setIsRecordPaymentOpen,
    bills,
    selectedBillId,
    setSelectedBillId,
    recordPayment,
    selectedMonth,
  } = usePG();

  // Pick candidate bills (unpaid or partially paid)
  const pendingBills = bills.filter((b) => b.outstandingAmount > 0);

  const [activeBillId, setActiveBillId] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');

  // Sync active bill when selectedBillId or pendingBills changes
  useEffect(() => {
    if (selectedBillId) {
      setActiveBillId(selectedBillId);
    } else if (pendingBills.length > 0) {
      setActiveBillId(pendingBills[0].id);
    }
  }, [selectedBillId, isRecordPaymentOpen]);

  const currentBill = bills.find((b) => b.id === activeBillId);

  // Update amount when currentBill changes
  useEffect(() => {
    if (currentBill) {
      setPaymentAmount(currentBill.outstandingAmount);
      // Generate default simulated reference
      if (paymentMethod === 'UPI') {
        setReferenceNo(`UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/GPAY`);
      } else if (paymentMethod === 'Bank Transfer') {
        setReferenceNo(`NEFT/SBIN00${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setReferenceNo(`CASH-REC-${Math.floor(100 + Math.random() * 900)}`);
      }
    }
  }, [activeBillId, paymentMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBill) {
      setError('Please select a bill to record payment.');
      return;
    }
    if (paymentAmount <= 0) {
      setError('Payment amount must be greater than ₹0.');
      return;
    }
    if (paymentAmount > currentBill.outstandingAmount) {
      setError(`Payment cannot exceed the outstanding balance of ₹${currentBill.outstandingAmount.toLocaleString('en-IN')}.`);
      return;
    }

    setIsSubmitting(true);
    const res = recordPayment({
      billId: currentBill.id,
      amount: paymentAmount,
      method: paymentMethod,
      referenceNo,
      note,
    });
    setIsSubmitting(false);

    if (res.success) {
      setSelectedBillId(null);
      setIsRecordPaymentOpen(false);
      setError('');
    } else {
      setError(res.message);
    }
  };

  const calculatedRemaining = currentBill ? Math.max(0, currentBill.outstandingAmount - paymentAmount) : 0;

  return (
    <Modal
      isOpen={isRecordPaymentOpen}
      onClose={() => {
        setIsRecordPaymentOpen(false);
        setSelectedBillId(null);
      }}
      title="Record Rent Payment"
      subtitle="Log simulated UPI, Cash or Bank payments and update bill balance."
      maxWidth="540px"
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
          <button
            type="button"
            onClick={() => {
              setIsRecordPaymentOpen(false);
              setSelectedBillId(null);
            }}
            className="btn btn-outline btn-sm"
            style={{ minHeight: '38px', flex: '1 1 100px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary btn-sm"
            disabled={isSubmitting || !currentBill}
            style={{ minHeight: '38px', flex: '2 1 180px' }}
          >
            {isSubmitting ? 'Recording...' : 'Confirm & Record Payment'}
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              borderRadius: 'var(--radius-md)',
              color: '#b91c1c',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Bill Selection */}
        <div className="form-group">
          <label className="form-label">Allocate Payment To Bill *</label>
          {pendingBills.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--color-success)', padding: '10px 0' }}>
              All rent bills for {selectedMonth} are fully paid!
            </div>
          ) : (
            <select
              className="form-select"
              value={activeBillId}
              onChange={(e) => setActiveBillId(e.target.value)}
            >
              {pendingBills.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.tenantName} — Room {b.roomNumber} ({b.monthYear}) — Due: ₹{b.outstandingAmount.toLocaleString('en-IN')}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Selected Bill Balance Card */}
        {currentBill && (
          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '14px',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Tenant:</span>
              <strong>{currentBill.tenantName} (Room {currentBill.roomNumber}, Bed {currentBill.bedId})</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Total Bill Amount:</span>
              <span>₹{currentBill.billAmount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Already Paid:</span>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹{currentBill.amountPaid.toLocaleString('en-IN')}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid var(--color-border-light)',
                fontSize: '14px',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Outstanding Balance:</span>
              <span style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                ₹{currentBill.outstandingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        )}

        {/* Payment Amount & Quick Buttons */}
        <div className="form-group">
          <label className="form-label">Payment Amount (₹) *</label>
          <input
            type="number"
            className="form-input"
            value={paymentAmount || ''}
            onChange={(e) => setPaymentAmount(Number(e.target.value))}
            placeholder="Enter payment amount"
            step="100"
          />

          {currentBill && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setPaymentAmount(currentBill.outstandingAmount)}
                style={{ minHeight: '34px' }}
              >
                Full Outstanding (₹{currentBill.outstandingAmount.toLocaleString('en-IN')})
              </button>
              {currentBill.outstandingAmount > 3000 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setPaymentAmount(3000)}
                  style={{ minHeight: '34px' }}
                >
                  Partial (₹3,000)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Balance Preview */}
        {currentBill && paymentAmount > 0 && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: calculatedRemaining === 0 ? 'var(--status-available-bg)' : 'var(--status-reserved-bg)',
              border: '1px solid var(--color-border)',
              fontSize: '12.5px',
              marginBottom: '16px',
              color: calculatedRemaining === 0 ? 'var(--status-available)' : 'var(--status-reserved)',
            }}
          >
            <strong>Status Result:</strong> After this payment, remaining balance will be <strong>₹{calculatedRemaining.toLocaleString('en-IN')}</strong>. Bill will be marked as{' '}
            <strong>{calculatedRemaining === 0 ? 'PAID' : 'PARTIALLY PAID'}</strong>.
          </div>
        )}

        {/* Date & Payment Method */}
        <div className="grid-form-2" style={{ gap: '14px' }}>
          <div className="form-group">
            <label className="form-label">Payment Date</label>
            <input
              type="date"
              className="form-input"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Method</label>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            >
              <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
              <option value="Cash">Cash Receipt</option>
              <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
            </select>
          </div>
        </div>

        {/* Reference Number & Note */}
        <div className="form-group">
          <label className="form-label">Transaction Reference / UTR Number</label>
          <input
            type="text"
            className="form-input"
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
            placeholder="e.g. UPI/6278009182/GPAY"
          />
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notes (Optional)</label>
          <input
            type="text"
            className="form-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Received via GPay from father's account"
          />
        </div>
      </form>
    </Modal>
  );
};
