import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  Settings,
  Building,
  User,
  Shield,
  Fingerprint,
  RotateCcw,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoData, rooms } = usePG();

  const [name, setName] = useState(settings.name);
  const [branch, setBranch] = useState(settings.branch);
  const [address, setAddress] = useState(settings.address);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [defaultRent, setDefaultRent] = useState(settings.defaultRent);
  const [defaultDeposit, setDefaultDeposit] = useState(settings.defaultDeposit);
  const [maintenanceDeduction, setMaintenanceDeduction] = useState(settings.maintenanceDeduction);
  const [noticeDays, setNoticeDays] = useState(settings.noticeDays);
  const [rentDueDay, setRentDueDay] = useState(settings.rentDueDay);
  const [mealsIncluded, setMealsIncluded] = useState(settings.mealsIncluded);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      name,
      branch,
      address,
      contactPhone,
      defaultRent,
      defaultDeposit,
      maintenanceDeduction,
      noticeDays,
      rentDueDay,
      mealsIncluded,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const totalBeds = rooms.flatMap((r) => r.beds).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
            Property & Business Settings
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Configure default rent terms, deposit deductions, staff roles, and hardware integration previews.
          </p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="btn btn-outline"
          style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-border)', minHeight: '38px' }}
        >
          <RotateCcw size={15} />
          <span>Reset All Demo Data</span>
        </button>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--status-available-bg)',
            border: '1px solid #86efac',
            borderRadius: 'var(--radius-md)',
            color: 'var(--status-available)',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Check size={18} />
          <span>Settings saved successfully in demo state!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Section 1: Property Identity */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Building size={20} color="var(--color-primary)" />
            <h3 className="card-title">Property Profile & Branch</h3>
          </div>

          <div className="grid-form-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">PG / Property Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Branch Identifier</label>
              <input
                type="text"
                className="form-input"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Official Address</label>
            <input
              type="text"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="grid-form-2" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Owner / Caretaker Contact Number</label>
              <input
                type="text"
                className="form-input"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Capacity Overview</label>
              <div
                style={{
                  padding: '9px 12px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--color-text-main)',
                }}
              >
                3 Floors • {rooms.length} Rooms • {totalBeds} Registered Beds
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Settlement Rules */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Shield size={20} color="var(--color-primary)" />
            <h3 className="card-title">Default Rent, Deposit & Notice Rules</h3>
          </div>

          <div className="grid-form-3" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Default Monthly Rent (₹)</label>
              <input
                type="number"
                className="form-input"
                value={defaultRent}
                onChange={(e) => setDefaultRent(Number(e.target.value))}
              />
              <div className="form-help">Client baseline: ₹6,000/mo</div>
            </div>

            <div className="form-group">
              <label className="form-label">Default Security Deposit (₹)</label>
              <input
                type="number"
                className="form-input"
                value={defaultDeposit}
                onChange={(e) => setDefaultDeposit(Number(e.target.value))}
              />
              <div className="form-help">Client baseline: ₹3,000</div>
            </div>

            <div className="form-group">
              <label className="form-label">Standard Maintenance Deduction (₹)</label>
              <input
                type="number"
                className="form-input"
                value={maintenanceDeduction}
                onChange={(e) => setMaintenanceDeduction(Number(e.target.value))}
              />
              <div className="form-help">Deducted at checkout: ₹1,000</div>
            </div>
          </div>

          <div className="grid-form-3" style={{ gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Mandatory Notice Period (Days)</label>
              <input
                type="number"
                className="form-input"
                value={noticeDays}
                onChange={(e) => setNoticeDays(Number(e.target.value))}
              />
              <div className="form-help">Client rule: 15 days</div>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent Due Day</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max="28"
                value={rentDueDay}
                onChange={(e) => setRentDueDay(Number(e.target.value))}
              />
              <div className="form-help">e.g. 5th of every month</div>
            </div>

            <div className="form-group">
              <label className="form-label">Mess & Meal Inclusion</label>
              <div style={{ display: 'flex', alignItems: 'center', minHeight: '38px', gap: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={mealsIncluded}
                    onChange={(e) => setMealsIncluded(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>Meals Included</span>
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', minHeight: '38px' }}>
            Save Changes
          </button>
        </div>

        {/* Section 3: Biometric Access Hardware Integration Preview */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Fingerprint size={20} color="var(--color-primary)" />
            <h3 className="card-title">Biometric Device Integration</h3>
          </div>

          <div
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                  Main Gate Biometric Fingerprint / Face Scanner
                </strong>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Supported protocols: ZKTeco / eSSL SDK, TCP/IP Push API
                </div>
              </div>

              {/* Status Badge per prompt requirement */}
              <div
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  color: '#b91c1c',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <AlertCircle size={14} />
                <span>Not Connected — Integration Required</span>
              </div>
            </div>

            <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
              * <em>Notice for client review:</em> This frontend prototype does not enroll physical fingerprints or unlock hardware turnstiles. In the final production deployment, an on-premise hardware gateway or static IP bridge can be paired to sync tenant move-in and checkout events with the entrance turnstile.
            </p>
          </div>
        </div>

        {/* Section 4: Staff & Access Control Preview */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <User size={20} color="var(--color-primary)" />
            <h3 className="card-title">Staff & Role-Based Access</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                gap: '8px',
              }}
            >
              <div>
                <strong>{settings.ownerName}</strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Primary Owner • Full Administrator Access</div>
              </div>
              <span className="badge badge-occupied">Owner (Superadmin)</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                gap: '8px',
              }}
            >
              <div>
                <strong>Sachin G. (Manager)</strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>On-site Caretaker • Daily Collection & Move-in</div>
              </div>
              <span className="badge badge-available">Staff (Limited)</span>
            </div>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setIsResetConfirmOpen(false);
        }}
        title="Reset All Demo Records?"
        message="This will reset all tenants, rooms, bills, and deposit records back to the initial sample scenario. Any mock payments or tenants you created will be reset."
        confirmText="Reset to Seed Data"
        cancelText="Keep Current State"
        type="warning"
      />
    </div>
  );
};
