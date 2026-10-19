import React, { useState, useEffect } from 'react';
import { usePG } from '../../context/PGContext';
import { Modal } from '../common/Modal';
import type { PaymentMethod } from '../../types';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const AddTenantModal: React.FC = () => {
  const { isAddTenantOpen, setIsAddTenantOpen, rooms, settings, addTenant } = usePG();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [joiningDate, setJoiningDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('102');
  const [selectedBedId, setSelectedBedId] = useState<string>('102-C');
  const [monthlyRent, setMonthlyRent] = useState<number>(settings.defaultRent);
  const [securityDeposit, setSecurityDeposit] = useState<number>(settings.defaultDeposit);
  const [initialRentReceived, setInitialRentReceived] = useState<number>(settings.defaultRent);
  const [initialDepositReceived, setInitialDepositReceived] = useState<number>(settings.defaultDeposit);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [workOrCollege, setWorkOrCollege] = useState('');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available beds filtered by selected room
  const availableBeds = rooms
    .flatMap((r) => r.beds)
    .filter((b) => b.status === 'available' || b.status === 'reserved');

  const filteredRooms = rooms.filter((r) => r.floor === selectedFloor);
  const currentRoom = rooms.find((r) => r.roomNumber === selectedRoomNumber);
  const currentRoomBeds = currentRoom
    ? currentRoom.beds.filter((b) => b.status === 'available' || b.status === 'reserved')
    : [];

  // When room changes, pick first available bed
  useEffect(() => {
    if (currentRoomBeds.length > 0 && !currentRoomBeds.some((b) => b.id === selectedBedId)) {
      setSelectedBedId(currentRoomBeds[0].id);
    }
  }, [selectedRoomNumber, currentRoomBeds]);

  // When bed changes, adjust rent if room has baseMonthlyRent
  useEffect(() => {
    if (currentRoom) {
      setMonthlyRent(currentRoom.baseMonthlyRent);
      setInitialRentReceived(currentRoom.baseMonthlyRent);
    }
  }, [selectedRoomNumber, currentRoom]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Tenant name is required';
    if (!phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+ -]{10,14}$/.test(phone.trim())) {
      errs.phone = 'Enter a valid 10-digit mobile number';
    }
    if (!selectedBedId) errs.bedId = 'Please select an available bed';
    if (monthlyRent <= 0) errs.monthlyRent = 'Monthly rent must be greater than zero';
    if (securityDeposit < 0) errs.securityDeposit = 'Deposit cannot be negative';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = addTenant({
      name,
      phone,
      email,
      emergencyContact,
      joiningDate,
      floor: selectedFloor,
      roomNumber: selectedRoomNumber,
      bedId: selectedBedId,
      monthlyRent,
      securityDeposit,
      initialRentReceived,
      initialDepositReceived,
      paymentMethod,
      workOrCollege,
      notes,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Reset form
      setName('');
      setPhone('');
      setEmail('');
      setEmergencyContact('');
      setWorkOrCollege('');
      setNotes('');
      setErrors({});
      setIsAddTenantOpen(false);
    } else {
      setErrors({ form: result.message });
    }
  };

  return (
    <Modal
      isOpen={isAddTenantOpen}
      onClose={() => setIsAddTenantOpen(false)}
      title="Add New Tenant (Move-in)"
      subtitle="Register a new occupant, assign an available bed, and record initial payments."
      maxWidth="680px"
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
          <button
            type="button"
            onClick={() => setIsAddTenantOpen(false)}
            className="btn btn-outline btn-sm"
            style={{ minHeight: '38px', flex: '1 1 100px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary btn-sm"
            disabled={isSubmitting || availableBeds.length === 0}
            style={{ minHeight: '38px', flex: '2 1 180px' }}
          >
            Confirm Move-in & Assign Bed
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit}>
        {errors.form && (
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
            <span>{errors.form}</span>
          </div>
        )}

        {availableBeds.length === 0 && (
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fcd34d',
              borderRadius: 'var(--radius-md)',
              color: '#92400e',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            All beds are currently occupied or in maintenance. You can release a bed via checkout first.
          </div>
        )}

        {/* Section 1: Personal Details */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}>
            1. Personal & Contact Details
          </h4>

          <div className="grid-form-2" style={{ gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Abhishek Deshpande"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <div className="form-error">{errors.phone}</div>}
            </div>
          </div>

          <div className="grid-form-2" style={{ gap: '14px', marginTop: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. abhi@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Emergency Contact / Guardian</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +91 98221 11223 (Father)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-form-2" style={{ gap: '14px', marginTop: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">College / Company</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Modern College / TCS Hinjewadi"
                value={workOrCollege}
                onChange={(e) => setWorkOrCollege(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Joining Date *</label>
              <input
                type="date"
                className="form-input"
                value={joiningDate}
                onChange={(e) => setJoiningDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Room & Bed Assignment */}
        <div style={{ marginBottom: '18px' }}>
          <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}>
            2. Room & Bed Assignment
          </h4>

          <div className="grid-form-3" style={{ gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Floor</label>
              <select
                className="form-select"
                value={selectedFloor}
                onChange={(e) => {
                  const f = Number(e.target.value);
                  setSelectedFloor(f);
                  const firstRoomOnFloor = rooms.find((r) => r.floor === f);
                  if (firstRoomOnFloor) setSelectedRoomNumber(firstRoomOnFloor.roomNumber);
                }}
              >
                <option value={1}>Floor 1</option>
                <option value={2}>Floor 2</option>
                <option value={3}>Floor 3</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Room Number</label>
              <select
                className="form-select"
                value={selectedRoomNumber}
                onChange={(e) => setSelectedRoomNumber(e.target.value)}
              >
                {filteredRooms.map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    Room {r.roomNumber} ({r.type} sharing)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Available Bed *</label>
              <select
                className="form-select"
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                disabled={currentRoomBeds.length === 0}
              >
                {currentRoomBeds.length === 0 ? (
                  <option value="">No beds available in this room</option>
                ) : (
                  currentRoomBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bedLabel} ({b.status})
                    </option>
                  ))
                )}
              </select>
              {errors.bedId && <div className="form-error">{errors.bedId}</div>}
            </div>
          </div>
        </div>

        {/* Section 3: Financial Terms & Initial Payments */}
        <div>
          <h4 style={{ fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '4px' }}>
            3. Financials & Initial Move-in Collection
          </h4>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--color-primary-subtle)',
              border: '1px solid var(--color-primary-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12.5px',
              color: 'var(--color-primary)',
              marginBottom: '12px',
            }}
          >
            <strong>Standard Terms:</strong> Monthly Rent: ₹{monthlyRent.toLocaleString('en-IN')} (incl. meals) + Security Deposit: ₹{securityDeposit.toLocaleString('en-IN')}. Total expected: ₹{(monthlyRent + securityDeposit).toLocaleString('en-IN')}.
          </div>

          <div className="grid-form-2" style={{ gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Monthly Rent (₹)</label>
              <input
                type="number"
                className="form-input"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Rent Collected Today (₹)</label>
              <input
                type="number"
                className="form-input"
                value={initialRentReceived}
                onChange={(e) => setInitialRentReceived(Number(e.target.value))}
              />
              <div className="form-help">
                {initialRentReceived >= monthlyRent
                  ? 'Full month rent received'
                  : `Balance: ₹${(monthlyRent - initialRentReceived).toLocaleString('en-IN')}`}
              </div>
            </div>
          </div>

          <div className="grid-form-2" style={{ gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Security Deposit Required (₹)</label>
              <input
                type="number"
                className="form-input"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Initial Deposit Collected Today (₹)</label>
              <input
                type="number"
                className="form-input"
                value={initialDepositReceived}
                onChange={(e) => setInitialDepositReceived(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              {(['UPI', 'Cash', 'Bank Transfer'] as PaymentMethod[]).map((m) => (
                <label key={m} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === m}
                    onChange={() => setPaymentMethod(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};
