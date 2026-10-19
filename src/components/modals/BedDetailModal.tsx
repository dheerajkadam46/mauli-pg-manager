import React, { useState } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import type { BedStatus } from '../../types';
import {
  User,
  Phone,
  Calendar,
  AlertCircle,
  Wrench,
  CheckCircle2,
  ArrowRightLeft,
  LogOut,
  UserPlus,
} from 'lucide-react';
import { TransferBedModal } from './TransferBedModal';

interface BedDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bedId: string | null;
}

export const BedDetailModal: React.FC<BedDetailModalProps> = ({ isOpen, onClose, bedId }) => {
  const {
    getBedById,
    getTenantById,
    getTenantCurrentBill,
    updateBedStatus,
    setIsAddTenantOpen,
    setIsCheckoutWizardOpen,
    setSelectedTenantId,
    setActiveTab,
  } = usePG();

  const [isTransferOpen, setIsTransferOpen] = useState(false);

  if (!bedId) return null;
  const bedInfo = getBedById(bedId);
  if (!bedInfo) return null;

  const { bed, room } = bedInfo;
  const tenant = bed.currentTenantId ? getTenantById(bed.currentTenantId) : null;
  const currentBill = tenant ? getTenantCurrentBill(tenant.id) : null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Room ${room.roomNumber} — ${bed.bedLabel}`}
        subtitle={`Floor ${room.floor} • ${room.type.toUpperCase()} Sharing • ${room.hasAttachedBath ? 'Attached Bath' : 'Common Bath'} • ${room.hasAC ? 'AC' : 'Non-AC'}`}
        maxWidth="500px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
            <button onClick={onClose} className="btn btn-outline btn-sm">
              Close
            </button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Status Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              backgroundColor: 'var(--color-bg)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Bed Status:</span>
            <Badge type="bed" status={bed.status} />
          </div>

          {/* Occupant Details If Occupied / Notice */}
          {tenant ? (
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  {tenant.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', color: 'var(--color-primary)' }}>{tenant.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{tenant.workOrCollege || 'Tenant'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Phone:</span> <strong>{tenant.phone}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Joined:</span> <span>{tenant.joiningDate}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Rent:</span> <strong>₹{tenant.monthlyRent.toLocaleString('en-IN')}/mo</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Current Bill:</span>{' '}
                  <span style={{ fontWeight: 600, color: currentBill?.outstandingAmount ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {currentBill ? `₹${currentBill.outstandingAmount.toLocaleString('en-IN')} Due` : 'Cleared'}
                  </span>
                </div>
              </div>

              {/* Action Buttons for this Bed's Tenant */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                >
                  <ArrowRightLeft size={14} />
                  <span>Transfer Bed</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedTenantId(tenant.id);
                    setIsCheckoutWizardOpen(true);
                    onClose();
                  }}
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1, color: 'var(--color-accent)' }}
                >
                  <LogOut size={14} />
                  <span>Start Checkout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Available or Maintenance Bed Actions */
            <div
              style={{
                border: '1px dashed var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#ffffff',
              }}
            >
              {bed.status === 'available' ? (
                <>
                  <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    This bed is clean, sanitized, and ready for immediate tenant move-in.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddTenantOpen(true);
                        onClose();
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <UserPlus size={15} />
                      <span>Assign New Tenant</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateBedStatus(bed.id, 'maintenance', 'Routine repair/cleaning')}
                      className="btn btn-outline btn-sm"
                    >
                      <Wrench size={15} />
                      <span>Set Maintenance</span>
                    </button>
                  </div>
                </>
              ) : bed.status === 'maintenance' ? (
                <>
                  <p style={{ fontSize: '13.5px', color: '#b45309', marginBottom: '8px', fontWeight: 600 }}>
                    Under Maintenance: {bed.maintenanceReason || 'Deep cleaning in progress'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
                    Cannot assign tenants while in maintenance. Once finished, mark bed as ready.
                  </p>
                  <button
                    type="button"
                    onClick={() => updateBedStatus(bed.id, 'available')}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 size={15} />
                    <span>Mark Maintenance Complete (Ready)</span>
                  </button>
                </>
              ) : bed.status === 'reserved' ? (
                <div>
                  <p style={{ fontSize: '13.5px', color: '#b45309', marginBottom: '8px', fontWeight: 600 }}>
                    Reserved with Advance Token
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Occupant scheduled to join shortly.
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </Modal>

      {/* Bed Transfer Modal */}
      {tenant && (
        <TransferBedModal
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
          tenant={tenant}
          currentBedId={bed.id}
        />
      )}
    </>
  );
};
