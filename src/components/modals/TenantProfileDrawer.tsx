import React, { useState } from 'react';
import { usePG } from '../../context/PGContext';
import { Badge } from '../common/Badge';
import {
  X,
  Phone,
  Mail,
  Calendar,
  Building,
  Receipt,
  ShieldCheck,
  Clock,
  LogOut,
  Edit,
  DollarSign,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { SubmitNoticeModal } from './SubmitNoticeModal';

interface TenantProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string | null;
}

export const TenantProfileDrawer: React.FC<TenantProfileDrawerProps> = ({
  isOpen,
  onClose,
  tenantId,
}) => {
  const {
    tenants,
    bills,
    deposits,
    activityLogs,
    setSelectedBillId,
    setIsRecordPaymentOpen,
    setSelectedTenantId,
    setIsCheckoutWizardOpen,
    setSelectedReceiptBill,
  } = usePG();

  const [activeTab, setActiveTab] = useState<'overview' | 'bills' | 'deposits' | 'activity'>('overview');
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  if (!isOpen || !tenantId) return null;

  const tenant = tenants.find((t) => t.id === tenantId);
  if (!tenant) return null;

  const tenantBills = bills.filter((b) => b.tenantId === tenant.id);
  const tenantPayments = tenantBills.flatMap((b) => b.payments);
  const depositRecord = deposits.find((d) => d.tenantId === tenant.id);
  const tenantLogs = activityLogs.filter((l) => l.tenantName === tenant.name);

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#fbfaf8',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '18px',
              }}
            >
              {tenant.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--color-primary)', margin: 0 }}>{tenant.name}</h3>
                <Badge type="tenancy" status={tenant.status} />
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Floor {tenant.floor} • Room {tenant.roomNumber} ({tenant.bedId})
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn-icon">
            <X size={20} />
          </button>
        </div>

        {/* Quick Action Ribbon */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border-light)',
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {tenant.status !== 'checked_out' && (
            <>
              <button
                onClick={() => {
                  const bill = tenantBills.find((b) => b.outstandingAmount > 0);
                  if (bill) setSelectedBillId(bill.id);
                  setIsRecordPaymentOpen(true);
                }}
                className="btn btn-subtle btn-sm"
              >
                <DollarSign size={14} />
                <span>Record Rent</span>
              </button>

              {tenant.status !== 'notice' && tenant.status !== 'upcoming_checkout' && (
                <button
                  onClick={() => setIsNoticeModalOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-border)' }}
                >
                  <AlertCircle size={14} />
                  <span>Give Notice</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedTenantId(tenant.id);
                  setIsCheckoutWizardOpen(true);
                }}
                className="btn btn-outline btn-sm"
                style={{ color: 'var(--color-danger)' }}
              >
                <LogOut size={14} />
                <span>Start Checkout</span>
              </button>
            </>
          )}
        </div>

        {/* Drawer Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: '#ffffff',
            padding: '0 16px',
          }}
        >
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'bills', label: `Bills (${tenantBills.length})` },
            { id: 'deposits', label: 'Deposit' },
            { id: 'activity', label: 'History' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 14px',
                border: 'none',
                background: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px' }}>
                  Contact Information
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Phone size={16} color="var(--color-text-muted)" />
                    <span>{tenant.phone}</span>
                  </div>
                  {tenant.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Mail size={16} color="var(--color-text-muted)" />
                      <span>{tenant.email}</span>
                    </div>
                  )}
                  {tenant.emergencyContact && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <AlertCircle size={16} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Emergency Contact / Guardian</div>
                        <div>{tenant.emergencyContact}</div>
                      </div>
                    </div>
                  )}
                  {tenant.workOrCollege && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Building size={16} color="var(--color-text-muted)" />
                      <span>{tenant.workOrCollege}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px' }}>
                  Tenancy & Financial Terms
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Joining Date</div>
                    <strong>{tenant.joiningDate}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Monthly Rent (incl meals)</div>
                    <strong>₹{tenant.monthlyRent.toLocaleString('en-IN')}/month</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Security Deposit Received</div>
                    <strong style={{ color: 'var(--color-success)' }}>₹{tenant.securityDepositReceived.toLocaleString('en-IN')}</strong>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Notice Period Rule</div>
                    <span>15 Days Prior</span>
                  </div>
                </div>

                {tenant.noticeDate && (
                  <div
                    style={{
                      marginTop: '12px',
                      padding: '10px',
                      backgroundColor: '#fff7ed',
                      border: '1px solid #fed7aa',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12.5px',
                      color: '#9a3412',
                    }}
                  >
                    <strong>Notice Status:</strong> Notice submitted on {tenant.noticeDate}. Intended checkout: {tenant.intendedDepartureDate}.
                  </div>
                )}
              </div>

              {tenant.notes && (
                <div className="card" style={{ padding: '16px' }}>
                  <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '8px' }}>
                    Notes & Remarks
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>{tenant.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BILLS & PAYMENTS */}
          {activeTab === 'bills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tenantBills.map((bill) => (
                <div
                  key={bill.id}
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '14px' }}>{bill.monthYear}</strong>
                    <Badge type="bill" status={bill.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '12.5px', marginBottom: '10px' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Billed:</span> ₹{bill.billAmount.toLocaleString('en-IN')}
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Paid:</span> ₹{bill.amountPaid.toLocaleString('en-IN')}
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Balance:</span>{' '}
                      <strong style={{ color: bill.outstandingAmount > 0 ? 'var(--color-accent)' : 'inherit' }}>
                        ₹{bill.outstandingAmount.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button
                      onClick={() => setSelectedReceiptBill(bill)}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '12px' }}
                    >
                      <Receipt size={13} />
                      <span>View Receipt</span>
                    </button>
                    {bill.outstandingAmount > 0 && (
                      <button
                        onClick={() => {
                          setSelectedBillId(bill.id);
                          setIsRecordPaymentOpen(true);
                        }}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '12px' }}
                      >
                        Record Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: SECURITY DEPOSIT LEDGER */}
          {activeTab === 'deposits' && (
            <div>
              {depositRecord ? (
                <div className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '15px', color: 'var(--color-primary)' }}>Deposit Account</h4>
                    <span className="badge" style={{ textTransform: 'uppercase' }}>{depositRecord.settlementStatus}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Expected Deposit:</span>
                      <strong>₹{depositRecord.expectedAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Amount Actually Received:</span>
                      <strong style={{ color: 'var(--color-success)' }}>₹{depositRecord.receivedAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    {depositRecord.deductionAmount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                        <span>Approved Deductions:</span>
                        <span>-₹{depositRecord.deductionAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    {depositRecord.settlementStatus === 'refunded' ? (
                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 700,
                        }}
                      >
                        <span>Refund Paid:</span>
                        <span style={{ color: 'var(--color-primary)' }}>₹{depositRecord.refundPaid.toLocaleString('en-IN')} ({depositRecord.refundMethod})</span>
                      </div>
                    ) : (
                      <div
                        style={{
                          marginTop: '8px',
                          paddingTop: '8px',
                          borderTop: '1px solid var(--color-border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 700,
                        }}
                      >
                        <span>Estimated Refund Due at Checkout:</span>
                        <span style={{ color: 'var(--color-accent)' }}>
                          ₹{Math.max(0, depositRecord.receivedAmount - 1000).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No deposit ledger record found.</div>
              )}
            </div>
          )}

          {/* TAB 4: ACTIVITY HISTORY */}
          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tenantLogs.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>No logged activities for this tenant.</div>
              ) : (
                tenantLogs.map((log) => (
                  <div
                    key={log.id}
                    style={{
                      padding: '12px',
                      backgroundColor: 'var(--color-bg)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12.5px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--color-primary)' }}>{log.title}</strong>
                      <span style={{ color: 'var(--color-text-light)', fontSize: '11px' }}>{log.timestamp}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-main)', margin: 0 }}>{log.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <SubmitNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        tenantId={tenant.id}
      />
    </div>
  );
};
