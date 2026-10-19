import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { Badge } from '../components/common/Badge';
import { StatCard } from '../components/common/StatCard';
import {
  ShieldCheck,
  IndianRupee,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';

export const DepositsPage: React.FC = () => {
  const {
    deposits,
    tenants,
    metrics,
    settings,
    setIsCheckoutWizardOpen,
    setSelectedTenantId,
  } = usePG();

  // Interactive Calculator State
  const [calcTenantId, setCalcTenantId] = useState<string>(tenants[0]?.id || '');
  const [customReceived, setCustomReceived] = useState<number>(3000);
  const [customMaintenance, setCustomMaintenance] = useState<number>(1000);
  const [customDamage, setCustomDamage] = useState<number>(0);
  const [customUnpaidRent, setCustomUnpaidRent] = useState<number>(0);

  // When selected tenant changes, pre-fill calculator
  const handleCalcTenantChange = (tId: string) => {
    setCalcTenantId(tId);
    const dep = deposits.find((d) => d.tenantId === tId);
    if (dep) {
      setCustomReceived(dep.receivedAmount);
    }
  };

  const netRefund = Math.max(0, customReceived - customMaintenance - customDamage - customUnpaidRent);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
          Security Deposit Management & Settlement
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          Tracking security deposits received, approved maintenance deductions, and checkout refunds.
        </p>
      </div>

      {/* Rules Policy Alert Banner */}
      <div
        style={{
          padding: '16px 20px',
          backgroundColor: 'var(--color-primary-subtle)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-primary-border)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px',
        }}
      >
        <ShieldCheck size={24} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '15px', color: 'var(--color-primary)', marginBottom: '4px' }}>
            Mauli PG Standard Terms & Settlement Policy
          </h4>
          <div style={{ fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
            • <strong>Monthly Rent:</strong> ₹6,000/mo (including meals) • <strong>Security Deposit:</strong> ₹3,000 • <strong>Initial Move-in:</strong> ₹9,000<br />
            • <strong>Standard Notice:</strong> 15 Days required • <strong>Standard Maintenance Deduction:</strong> ₹1,000 deducted at departure for painting & deep sanitation • <strong>Standard Refund Due:</strong> <strong>₹2,000</strong> (assuming ₹3,000 full deposit was received).
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          label="Total Deposits Expected"
          value={`₹${metrics.totalDepositsExpected.toLocaleString('en-IN')}`}
          subtext={`${deposits.length} total tenancy records`}
          icon={ShieldCheck}
        />

        <StatCard
          label="Total Deposits Received & Held"
          value={`₹${metrics.totalDepositsReceived.toLocaleString('en-IN')}`}
          subtext="Actual cash / UPI deposits received"
          icon={IndianRupee}
          iconBgColor="var(--status-available-bg)"
          iconColor="var(--status-available)"
        />

        <StatCard
          label="Awaiting Settlement"
          value={metrics.depositsAwaitingSettlement}
          subtext="Tenants on notice"
          icon={Clock}
          iconBgColor="var(--status-notice-bg)"
          iconColor="var(--status-notice)"
        />

        <StatCard
          label="Refunds Completed & Settled"
          value={`₹${metrics.refundsCompletedAmount.toLocaleString('en-IN')}`}
          subtext="Historical processed refunds"
          icon={CheckCircle}
          iconBgColor="#f1f5f9"
          iconColor="#475569"
        />
      </div>

      {/* Interactive Checkout Deposit Calculator Box */}
      <div className="card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Calculator size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', color: 'var(--color-primary)' }}>
              Working Interactive Checkout Deposit Calculator
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
              Inspect and test how deductions and refunds are calculated transparently for any tenant.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Pick Tenant (or test custom)</label>
              <select
                className="form-select"
                value={calcTenantId}
                onChange={(e) => handleCalcTenantChange(e.target.value)}
              >
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (Room {t.roomNumber}, {t.bedId}) — Deposit Received: ₹{t.securityDepositReceived}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Deposit Received (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={customReceived}
                  onChange={(e) => setCustomReceived(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Standard Maintenance (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={customMaintenance}
                  onChange={(e) => setCustomMaintenance(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Damage / Repair Charges (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={customDamage}
                  onChange={(e) => setCustomDamage(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px' }}>Unpaid Rent Adjustment (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={customUnpaidRent}
                  onChange={(e) => setCustomUnpaidRent(Number(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Transparent Breakdown Display */}
          <div
            style={{
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '10px' }}>
                Itemized Settlement Statement
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Deposit Received:</span>
                  <strong>₹{customReceived.toLocaleString('en-IN')}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                  <span>Less: Maintenance & Deep Cleaning:</span>
                  <span>-₹{customMaintenance.toLocaleString('en-IN')}</span>
                </div>

                {customDamage > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                    <span>Less: Damage Deductions:</span>
                    <span>-₹{customDamage.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {customUnpaidRent > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-danger)' }}>
                    <span>Less: Unpaid Rent Dues:</span>
                    <span>-₹{customUnpaidRent.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                paddingTop: '12px',
                borderTop: '2px solid var(--color-border)',
                marginTop: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Net Refund Payable:
                </span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-accent)' }}>
                  ₹{netRefund.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Formula: ₹{customReceived} - ₹{customMaintenance} {customDamage > 0 ? `- ₹${customDamage}` : ''} {customUnpaidRent > 0 ? `- ₹${customUnpaidRent}` : ''} = ₹{netRefund}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Ledger Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Room & Bed</th>
              <th>Expected Deposit</th>
              <th>Amount Received</th>
              <th>Approved Deductions</th>
              <th>Refund Due</th>
              <th>Refund Paid</th>
              <th>Settlement Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((dep) => (
              <tr key={dep.id}>
                <td>
                  <strong style={{ color: 'var(--color-primary)' }}>{dep.tenantName}</strong>
                </td>

                <td>
                  <div>Room {dep.roomNumber}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{dep.bedId}</div>
                </td>

                <td>₹{dep.expectedAmount.toLocaleString('en-IN')}</td>

                <td>
                  <strong style={{ color: dep.receivedAmount > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                    ₹{dep.receivedAmount.toLocaleString('en-IN')}
                  </strong>
                </td>

                <td>
                  {dep.deductionAmount > 0 ? (
                    <span style={{ color: 'var(--color-danger)', fontWeight: 600 }}>
                      -₹{dep.deductionAmount.toLocaleString('en-IN')}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>₹0</span>
                  )}
                </td>

                <td>
                  {dep.refundDue > 0 ? (
                    <strong style={{ color: 'var(--color-accent)' }}>
                      ₹{dep.refundDue.toLocaleString('en-IN')}
                    </strong>
                  ) : (
                    <span>₹0</span>
                  )}
                </td>

                <td>
                  {dep.refundPaid > 0 ? (
                    <div>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        ₹{dep.refundPaid.toLocaleString('en-IN')}
                      </span>
                      {dep.refundMethod && (
                        <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                          via {dep.refundMethod}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--color-text-muted)' }}>-</span>
                  )}
                </td>

                <td>
                  <span
                    className="badge"
                    style={{
                      textTransform: 'uppercase',
                      backgroundColor:
                        dep.settlementStatus === 'refunded'
                          ? '#e2e8f0'
                          : dep.settlementStatus === 'awaiting_settlement'
                          ? 'var(--status-notice-bg)'
                          : 'var(--status-occupied-bg)',
                      color:
                        dep.settlementStatus === 'refunded'
                          ? '#475569'
                          : dep.settlementStatus === 'awaiting_settlement'
                          ? 'var(--status-notice)'
                          : 'var(--status-occupied)',
                    }}
                  >
                    {dep.settlementStatus.replace('_', ' ')}
                  </span>
                </td>

                <td style={{ textAlign: 'right' }}>
                  {dep.settlementStatus === 'awaiting_settlement' && (
                    <button
                      onClick={() => {
                        setSelectedTenantId(dep.tenantId);
                        setIsCheckoutWizardOpen(true);
                      }}
                      className="btn btn-accent btn-sm"
                      style={{ fontSize: '11.5px', padding: '4px 8px' }}
                    >
                      Settle Refund
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
