import React, { useState, useEffect } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import type { DeductionItem, PaymentMethod } from '../../types';
import {
  CheckCircle,
  AlertTriangle,
  Receipt,
  ShieldCheck,
  CheckSquare,
  Plus,
  Trash2,
  ArrowRight,
} from 'lucide-react';

export const CheckoutWizardModal: React.FC = () => {
  const {
    isCheckoutWizardOpen,
    setIsCheckoutWizardOpen,
    tenants,
    selectedTenantId,
    setSelectedTenantId,
    bills,
    deposits,
    settings,
    checkoutTenant,
  } = usePG();

  // Filter candidates for checkout (active or notice or upcoming_checkout)
  const candidates = tenants.filter(
    (t) => t.status === 'active' || t.status === 'notice' || t.status === 'upcoming_checkout'
  );

  const [activeTenantId, setActiveTenantId] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Deductions state
  const [deductions, setDeductions] = useState<DeductionItem[]>([
    { id: 'd-maint', reason: 'Standard Maintenance & Deep Sanitization', amount: 1000 },
  ]);
  const [newReason, setNewReason] = useState('');
  const [newAmount, setNewAmount] = useState(0);

  // Inspection checklist
  const [checklist, setChecklist] = useState({
    roomKeysReturned: true,
    cupboardInspected: true,
    electricalAndGeyserChecked: true,
    noPropertyDamage: true,
  });

  // Refund execution
  const [refundMethod, setRefundMethod] = useState<PaymentMethod>('UPI');
  const [refundRefNo, setRefundRefNo] = useState(() => `UPI/REF-${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [markBedAs, setMarkBedAs] = useState<'available' | 'maintenance'>('available');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (selectedTenantId) {
      setActiveTenantId(selectedTenantId);
    } else if (candidates.length > 0 && !activeTenantId) {
      // Find candidate with notice first, e.g. Tanmay or Aditya
      const noticeCand = candidates.find((t) => t.status === 'upcoming_checkout' || t.status === 'notice');
      setActiveTenantId(noticeCand ? noticeCand.id : candidates[0].id);
    }
  }, [selectedTenantId, candidates, isCheckoutWizardOpen]);

  const tenant = tenants.find((t) => t.id === activeTenantId);
  const tenantBills = bills.filter((b) => b.tenantId === activeTenantId);
  const totalOutstandingRent = tenantBills.reduce((acc, b) => acc + b.outstandingAmount, 0);
  const depositRecord = deposits.find((d) => d.tenantId === activeTenantId);

  const depositReceived = depositRecord ? depositRecord.receivedAmount : (tenant ? tenant.securityDepositReceived : 3000);
  const totalDeductions = deductions.reduce((sum, d) => sum + d.amount, 0);
  const calculatedRefundDue = Math.max(0, depositReceived - totalDeductions - totalOutstandingRent);

  const handleAddDeduction = () => {
    if (!newReason.trim() || newAmount <= 0) return;
    setDeductions((prev) => [
      ...prev,
      { id: `ded-${Date.now()}`, reason: newReason.trim(), amount: newAmount },
    ]);
    setNewReason('');
    setNewAmount(0);
  };

  const handleRemoveDeduction = (id: string) => {
    setDeductions((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCompleteCheckout = () => {
    if (!tenant) return;
    setIsSubmitting(true);

    const res = checkoutTenant({
      tenantId: tenant.id,
      deductions,
      refundPaid: calculatedRefundDue,
      refundMethod,
      refundRefNo,
      markBedAs,
    });

    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        setIsCheckoutWizardOpen(false);
        setSelectedTenantId(null);
        setCurrentStep(1);
        setSuccessMsg('');
      }, 1500);
    }
  };

  const allChecklistPassed = Object.values(checklist).every(Boolean);

  return (
    <Modal
      isOpen={isCheckoutWizardOpen}
      onClose={() => {
        setIsCheckoutWizardOpen(false);
        setSelectedTenantId(null);
        setCurrentStep(1);
      }}
      title="Tenant Checkout & Settlement Wizard"
      subtitle="Complete tenancy departure, calculate transparent security deposit settlement, and release bed."
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="btn btn-outline btn-sm"
              disabled={isSubmitting}
            >
              Back
            </button>
          ) : <div />}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                setIsCheckoutWizardOpen(false);
                setSelectedTenantId(null);
              }}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-primary btn-sm"
                disabled={!tenant}
              >
                <span>Continue</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleCompleteCheckout}
                className="btn btn-accent btn-sm"
                disabled={isSubmitting || !allChecklistPassed}
              >
                {isSubmitting ? 'Finalizing...' : 'Confirm Checkout & Release Bed'}
              </button>
            )}
          </div>
        </div>
      }
    >
      {/* Step Indicators */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          borderBottom: '1px solid var(--color-border-light)',
          paddingBottom: '12px',
        }}
      >
        {[
          { step: 1, label: '1. Select & Rent Dues' },
          { step: 2, label: '2. Deposit Settlement' },
          { step: 3, label: '3. Room Inspection' },
          { step: 4, label: '4. Refund & Bed Release' },
        ].map((s) => (
          <div
            key={s.step}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: currentStep === s.step ? 'var(--color-primary)' : currentStep > s.step ? 'var(--color-success)' : 'var(--color-text-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: currentStep === s.step ? 'var(--color-primary)' : currentStep > s.step ? 'var(--color-success)' : 'var(--color-bg-subtle)',
                color: currentStep >= s.step ? '#ffffff' : 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
              }}
            >
              {s.step}
            </span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {successMsg ? (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            backgroundColor: 'var(--status-available-bg)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-success)',
          }}
        >
          <CheckCircle size={48} style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ color: 'var(--color-success)', marginBottom: '8px' }}>Checkout Completed!</h3>
          <p style={{ fontSize: '14px' }}>{successMsg}</p>
        </div>
      ) : (
        <>
          {/* STEP 1: Select Tenant & Outstanding Rent */}
          {currentStep === 1 && (
            <div>
              <div className="form-group">
                <label className="form-label">Select Tenant to Checkout *</label>
                <select
                  className="form-select"
                  value={activeTenantId}
                  onChange={(e) => setActiveTenantId(e.target.value)}
                >
                  {candidates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — Room {t.roomNumber} ({t.bedId}) — Status: {t.status.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {tenant && (
                <div
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Tenant Name:</span>{' '}
                      <strong>{tenant.name}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Room & Bed:</span>{' '}
                      <strong>Room {tenant.roomNumber} ({tenant.bedId})</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Joining Date:</span>{' '}
                      <span>{tenant.joiningDate}</span>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Notice Given:</span>{' '}
                      <span>{tenant.noticeDate || 'No notice logged'}</span>
                    </div>
                  </div>

                  {/* Rent status check */}
                  <div
                    style={{
                      marginTop: '14px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--color-border-light)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>Outstanding Rent Balance:</span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '15px',
                          color: totalOutstandingRent > 0 ? 'var(--color-danger)' : 'var(--color-success)',
                        }}
                      >
                        ₹{totalOutstandingRent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {totalOutstandingRent > 0 ? (
                      <div
                        style={{
                          marginTop: '8px',
                          fontSize: '12px',
                          color: 'var(--color-danger)',
                          backgroundColor: '#fee2e2',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                        }}
                      >
                        Warning: Tenant has ₹{totalOutstandingRent.toLocaleString('en-IN')} unpaid rent. This will be automatically adjusted against the deposit refund.
                      </div>
                    ) : (
                      <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--color-success)' }}>
                        All monthly rent bills are cleared.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Transparent Security Deposit Breakdown */}
          {currentStep === 2 && (
            <div>
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'var(--color-primary-subtle)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-primary-border)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Standard PG Terms Calculation:
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--color-primary-light)', marginTop: '2px' }}>
                  ₹3,000 Deposit Received − ₹1,000 Maintenance Deduction = ₹2,000 Net Refund Due
                </div>
              </div>

              {/* Deductions Ledger */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                  Approved Deductions:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                  {deductions.map((d) => (
                    <div
                      key={d.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        backgroundColor: '#f9fafb',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '13px',
                      }}
                    >
                      <span>{d.reason}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ color: 'var(--color-danger)' }}>-₹{d.amount.toLocaleString('en-IN')}</strong>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeduction(d.id)}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#9ca3af' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Deduction Form */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Other deduction reason (e.g. Broken chair)"
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    style={{ flex: 2, fontSize: '12.5px', padding: '6px 10px' }}
                  />
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Amount (₹)"
                    value={newAmount || ''}
                    onChange={(e) => setNewAmount(Number(e.target.value))}
                    style={{ flex: 1, fontSize: '12.5px', padding: '6px 10px' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddDeduction}
                    className="btn btn-outline btn-sm"
                    style={{ padding: '6px 12px' }}
                  >
                    <Plus size={14} />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Summary Calculation Table */}
              <div
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>Security Deposit Actually Received:</span>
                  <strong>₹{depositReceived.toLocaleString('en-IN')}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--color-danger)' }}>
                  <span>Total Approved Deductions:</span>
                  <span>-₹{totalDeductions.toLocaleString('en-IN')}</span>
                </div>
                {totalOutstandingRent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: 'var(--color-danger)' }}>
                    <span>Unpaid Rent Dues Offset:</span>
                    <span>-₹{totalOutstandingRent.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '15px',
                    fontWeight: 700,
                    paddingTop: '8px',
                    borderTop: '2px solid var(--color-border)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <span>Net Refund Payable to Tenant:</span>
                  <span style={{ color: 'var(--color-accent)' }}>₹{calculatedRefundDue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Room Inspection Checklist */}
          {currentStep === 3 && (
            <div>
              <div style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                Verify physical room and asset condition before releasing the security refund.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { key: 'roomKeysReturned', label: 'Room & Cupboard keys returned by occupant' },
                  { key: 'cupboardInspected', label: 'Wardrobe & drawers emptied and cleaned' },
                  { key: 'electricalAndGeyserChecked', label: 'Geyser, fan, and light fittings tested working' },
                  { key: 'noPropertyDamage', label: 'Mattress and furniture in good condition' },
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      backgroundColor: checklist[item.key as keyof typeof checklist] ? '#f0fdf4' : '#ffffff',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: '13.5px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.key as keyof typeof checklist]}
                      onChange={(e) =>
                        setChecklist({ ...checklist, [item.key]: e.target.checked })
                      }
                      style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                    />
                    <span style={{ fontWeight: 500 }}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Record Refund & Release Bed */}
          {currentStep === 4 && (
            <div>
              <div
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '16px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Final Refund Amount:</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '2px' }}>
                  ₹{calculatedRefundDue.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Refund Payment Mode</label>
                  <select
                    className="form-select"
                    value={refundMethod}
                    onChange={(e) => setRefundMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Refund Reference / Transaction No</label>
                  <input
                    type="text"
                    className="form-input"
                    value={refundRefNo}
                    onChange={(e) => setRefundRefNo(e.target.value)}
                  />
                </div>
              </div>

              {/* Bed Availability Control */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Bed Status After Departure</label>
                <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="markBedAs"
                      checked={markBedAs === 'available'}
                      onChange={() => setMarkBedAs('available')}
                    />
                    <span>
                      <strong>Mark as Available</strong> (Ready for immediate occupancy)
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="markBedAs"
                      checked={markBedAs === 'maintenance'}
                      onChange={() => setMarkBedAs('maintenance')}
                    />
                    <span>
                      <strong>Mark for Maintenance</strong> (Requires deep cleaning / painting)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
};
