import React, { useState, useEffect } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import { AlertTriangle, Calendar, Info } from 'lucide-react';

interface SubmitNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string | null;
}

export const SubmitNoticeModal: React.FC<SubmitNoticeModalProps> = ({ isOpen, onClose, tenantId }) => {
  const { tenants, submitNotice } = usePG();

  const tenant = tenants.find((t) => t.id === tenantId);

  const todayStr = new Date().toISOString().split('T')[0];
  const [noticeDate, setNoticeDate] = useState(todayStr);

  // Default departure date is 15 days later
  const getDefaultDeparture = (baseDateStr: string) => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  };

  const [departureDate, setDepartureDate] = useState(() => getDefaultDeparture(todayStr));
  const [error, setError] = useState('');

  useEffect(() => {
    setDepartureDate(getDefaultDeparture(noticeDate));
  }, [noticeDate]);

  if (!tenant) return null;

  // Calculate days between notice and departure
  const diffTime = Math.abs(new Date(departureDate).getTime() - new Date(noticeDate).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isLessThan15Days = diffDays < 15;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = submitNotice(tenant.id, noticeDate, departureDate);
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
      title="Submit Move-out Notice"
      subtitle={`Record formal notice for ${tenant.name} (Room ${tenant.roomNumber}, ${tenant.bedId})`}
      maxWidth="500px"
      footer={
        <>
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn btn-accent btn-sm">
            Confirm Notice Submission
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {error && <div className="form-error" style={{ marginBottom: '12px' }}>{error}</div>}

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
          <div><strong>Current Bed:</strong> Room {tenant.roomNumber} ({tenant.bedId})</div>
          <div><strong>Monthly Rent:</strong> ₹{tenant.monthlyRent.toLocaleString('en-IN')}</div>
        </div>

        <div className="form-group">
          <label className="form-label">Notice Submission Date *</label>
          <input
            type="date"
            className="form-input"
            value={noticeDate}
            onChange={(e) => setNoticeDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Intended Departure / Checkout Date *</label>
          <input
            type="date"
            className="form-input"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* 15 Days Policy Warning / Notice */}
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: isLessThan15Days ? '#fff7ed' : 'var(--color-primary-subtle)',
            border: `1px solid ${isLessThan15Days ? '#fdba74' : 'var(--color-primary-border)'}`,
            fontSize: '12.5px',
            color: isLessThan15Days ? '#9a3412' : 'var(--color-primary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
          }}
        >
          {isLessThan15Days ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} /> : <Info size={16} style={{ flexShrink: 0, marginTop: '2px' }} />}
          <div>
            <strong>Notice Duration: {diffDays} days.</strong>
            {isLessThan15Days ? (
              <div>
                PG rules stipulate a standard 15-day notice period. Short notice of {diffDays} days has been flagged for owner review during final checkout settlement.
              </div>
            ) : (
              <div>Standard 15-day notice requirement satisfied.</div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
};
