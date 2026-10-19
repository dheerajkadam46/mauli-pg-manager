import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { Badge } from '../components/common/Badge';
import { SubmitNoticeModal } from '../components/modals/SubmitNoticeModal';
import { CheckoutWizardModal } from '../components/modals/CheckoutWizardModal';
import {
  ArrowRightLeft,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  LogOut,
  Archive,
  Info,
} from 'lucide-react';
import type { TenancyStatus } from '../types';

export const LifecyclePage: React.FC = () => {
  const {
    tenants,
    setIsAddTenantOpen,
    setIsCheckoutWizardOpen,
    setSelectedTenantId,
    bills,
    deposits,
  } = usePG();

  const [activeStage, setActiveStage] = useState<TenancyStatus | 'all'>('all');
  const [noticeModalTenantId, setNoticeModalTenantId] = useState<string | null>(null);

  // Group tenants by lifecycle stages
  const activeTenants = tenants.filter((t) => t.status === 'active');
  const noticeTenants = tenants.filter((t) => t.status === 'notice');
  const upcomingCheckoutTenants = tenants.filter((t) => t.status === 'upcoming_checkout');
  const checkedOutTenants = tenants.filter((t) => t.status === 'checked_out');

  const filteredTenants = tenants.filter((t) => {
    if (activeStage === 'all') return true;
    return t.status === activeStage;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Move-In / Move-Out Lifecycle
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Structured pipeline from prospective move-in, 15-day notice tracking, to departure settlement.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={() => setIsAddTenantOpen(true)} className="btn btn-primary" style={{ minHeight: '38px' }}>
            <UserPlus size={16} />
            <span>Start Move-In</span>
          </button>

          <button
            onClick={() => setIsCheckoutWizardOpen(true)}
            className="btn btn-outline"
            style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-border)', minHeight: '38px' }}
          >
            <LogOut size={16} />
            <span>Start Checkout</span>
          </button>
        </div>
      </div>

      {/* Lifecycle Stage Cards */}
      <div className="grid-kpi-cards">
        <div
          onClick={() => setActiveStage('active')}
          style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: activeStage === 'active' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>1. Active</span>
            <span className="badge badge-occupied">{activeTenants.length}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-primary)', marginTop: '6px' }}>
            {activeTenants.length} Occupants
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Ongoing residents
          </div>
        </div>

        <div
          onClick={() => setActiveStage('notice')}
          style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: activeStage === 'notice' ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>2. On Notice</span>
            <span className="badge badge-notice">{noticeTenants.length}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-accent)', marginTop: '6px' }}>
            {noticeTenants.length} Leaving
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Serving 15-day notice
          </div>
        </div>

        <div
          onClick={() => setActiveStage('upcoming_checkout')}
          style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: activeStage === 'upcoming_checkout' ? '2px solid var(--color-warning)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>3. Checkout</span>
            <span className="badge badge-reserved">{upcomingCheckoutTenants.length}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-warning)', marginTop: '6px' }}>
            {upcomingCheckoutTenants.length} Ready
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Awaiting exit settlement
          </div>
        </div>

        <div
          onClick={() => setActiveStage('checked_out')}
          style={{
            padding: '16px',
            backgroundColor: '#ffffff',
            border: activeStage === 'checked_out' ? '2px solid #64748b' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>4. Archived</span>
            <span className="badge badge-maintenance">{checkedOutTenants.length}</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#475569', marginTop: '6px' }}>
            {checkedOutTenants.length} Settled
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Bed released & refunded
          </div>
        </div>
      </div>

      {/* Tenancy Pipeline Section */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="filter-tabs" style={{ maxWidth: '100%', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setActiveStage('all')}
              className={`filter-tab ${activeStage === 'all' ? 'active' : ''}`}
            >
              All Records ({tenants.length})
            </button>
            <button
              onClick={() => setActiveStage('active')}
              className={`filter-tab ${activeStage === 'active' ? 'active' : ''}`}
            >
              Active ({activeTenants.length})
            </button>
            <button
              onClick={() => setActiveStage('notice')}
              className={`filter-tab ${activeStage === 'notice' ? 'active' : ''}`}
            >
              On Notice ({noticeTenants.length})
            </button>
            <button
              onClick={() => setActiveStage('upcoming_checkout')}
              className={`filter-tab ${activeStage === 'upcoming_checkout' ? 'active' : ''}`}
            >
              Ready ({upcomingCheckoutTenants.length})
            </button>
            <button
              onClick={() => setActiveStage('checked_out')}
              className={`filter-tab ${activeStage === 'checked_out' ? 'active' : ''}`}
            >
              Archived ({checkedOutTenants.length})
            </button>
          </div>
        </div>

        {/* Mobile Card List (Visible <= 767px) */}
        <div className="mobile-card-list" style={{ padding: '16px' }}>
          {filteredTenants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
              No tenant records for this stage.
            </div>
          ) : (
            filteredTenants.map((t) => {
              const dep = deposits.find((d) => d.tenantId === t.id);
              return (
                <div key={t.id} className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--color-primary)' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        Room {t.roomNumber} • Bed {t.bedId} • {t.phone}
                      </div>
                    </div>
                    <Badge type="tenancy" status={t.status} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', backgroundColor: 'var(--color-bg-subtle)', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Joined: </span>
                      <strong>{t.joiningDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Notice: </span>
                      <strong style={{ color: t.noticeDate ? 'var(--color-accent)' : 'inherit' }}>{t.noticeDate || 'None'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Departure: </span>
                      <strong>{t.intendedDepartureDate || '-'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--color-text-muted)' }}>Deposit: </span>
                      <strong>{dep ? `₹${dep.receivedAmount.toLocaleString('en-IN')}` : '-'}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ paddingTop: '6px', borderTop: '1px solid var(--color-border-light)' }}>
                    {t.status === 'active' && (
                      <button
                        onClick={() => setNoticeModalTenantId(t.id)}
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', minHeight: '36px', fontSize: '12.5px' }}
                      >
                        Submit Notice
                      </button>
                    )}

                    {(t.status === 'notice' || t.status === 'upcoming_checkout') && (
                      <button
                        onClick={() => {
                          setSelectedTenantId(t.id);
                          setIsCheckoutWizardOpen(true);
                        }}
                        className="btn btn-accent btn-sm"
                        style={{ width: '100%', minHeight: '36px', fontSize: '12.5px' }}
                      >
                        Start Checkout
                      </button>
                    )}

                    {t.status === 'checked_out' && (
                      <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic', padding: '4px' }}>
                        Settled & Archived on {t.actualCheckoutDate || 'Record'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Tenancy Pipeline Table (Visible >= 768px) */}
        <div className="table-container desktop-table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table>
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Room & Bed</th>
                <th>Joining Date</th>
                <th>Notice Date</th>
                <th>Expected Departure</th>
                <th>Actual Checkout / Release</th>
                <th>Deposit Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((t) => {
                const dep = deposits.find((d) => d.tenantId === t.id);
                return (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{t.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>{t.phone}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600 }}>Room {t.roomNumber}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{t.bedId}</div>
                    </td>

                    <td style={{ fontSize: '12.5px' }}>{t.joiningDate}</td>

                    <td style={{ fontSize: '12.5px' }}>
                      {t.noticeDate ? (
                        <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
                          {t.noticeDate}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>-</span>
                      )}
                    </td>

                    <td style={{ fontSize: '12.5px' }}>
                      {t.intendedDepartureDate ? (
                        <strong>{t.intendedDepartureDate}</strong>
                      ) : (
                        <span style={{ color: 'var(--color-text-light)' }}>-</span>
                      )}
                    </td>

                    <td style={{ fontSize: '12.5px' }}>
                      {t.actualCheckoutDate ? (
                        <div>
                          <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                            {t.actualCheckoutDate}
                          </span>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Bed Released</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>Bed Occupied</span>
                      )}
                    </td>

                    <td>
                      {dep ? (
                        <div>
                          <span style={{ fontSize: '12.5px', fontWeight: 600 }}>
                            ₹{dep.receivedAmount.toLocaleString('en-IN')} held
                          </span>
                          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                            {dep.settlementStatus.replace('_', ' ')}
                          </div>
                        </div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      {t.status === 'active' && (
                        <button
                          onClick={() => setNoticeModalTenantId(t.id)}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                        >
                          Submit Notice
                        </button>
                      )}

                      {(t.status === 'notice' || t.status === 'upcoming_checkout') && (
                        <button
                          onClick={() => {
                            setSelectedTenantId(t.id);
                            setIsCheckoutWizardOpen(true);
                          }}
                          className="btn btn-accent btn-sm"
                          style={{ fontSize: '11.5px', padding: '4px 8px' }}
                        >
                          Start Checkout
                        </button>
                      )}

                      {t.status === 'checked_out' && (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          Settled & Archived
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <SubmitNoticeModal
        isOpen={!!noticeModalTenantId}
        onClose={() => setNoticeModalTenantId(null)}
        tenantId={noticeModalTenantId}
      />
    </div>
  );
};
