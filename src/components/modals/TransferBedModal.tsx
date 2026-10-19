import React, { useState } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import type { Tenant } from '../../types';
import { ArrowRightLeft, AlertCircle } from 'lucide-react';

interface TransferBedModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant;
  currentBedId: string;
}

export const TransferBedModal: React.FC<TransferBedModalProps> = ({
  isOpen,
  onClose,
  tenant,
  currentBedId,
}) => {
  const { rooms, transferTenantBed } = usePG();

  // Find all available beds except current bed
  const availableBeds = rooms
    .flatMap((r) => r.beds)
    .filter((b) => b.status === 'available' && b.id !== currentBedId);

  const [selectedTargetBedId, setSelectedTargetBedId] = useState<string>(
    availableBeds.length > 0 ? availableBeds[0].id : ''
  );
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTargetBedId) {
      setError('Please select an available bed.');
      return;
    }

    setIsSubmitting(true);
    const res = transferTenantBed(tenant.id, selectedTargetBedId);
    setIsSubmitting(false);

    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transfer Tenant to Another Bed"
      subtitle={`Move ${tenant.name} from Room ${tenant.roomNumber} (${currentBedId})`}
      maxWidth="480px"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTransfer}
            className="btn btn-primary btn-sm"
            disabled={isSubmitting || availableBeds.length === 0}
          >
            Confirm Bed Shift
          </button>
        </>
      }
    >
      <form onSubmit={handleTransfer}>
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
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            padding: '12px 14px',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          <div><strong>Tenant:</strong> {tenant.name}</div>
          <div><strong>Current Location:</strong> Floor {tenant.floor}, Room {tenant.roomNumber} ({currentBedId})</div>
        </div>

        {availableBeds.length === 0 ? (
          <div style={{ color: 'var(--color-accent)', fontSize: '13px', padding: '10px 0' }}>
            No other beds are currently available for transfer.
          </div>
        ) : (
          <div className="form-group">
            <label className="form-label">Select Available Destination Bed *</label>
            <select
              className="form-select"
              value={selectedTargetBedId}
              onChange={(e) => setSelectedTargetBedId(e.target.value)}
            >
              {availableBeds.map((b) => (
                <option key={b.id} value={b.id}>
                  Floor {b.floor} — Room {b.roomNumber} ({b.bedLabel})
                </option>
              ))}
            </select>
          </div>
        )}
      </form>
    </Modal>
  );
};
