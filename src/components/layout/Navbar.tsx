import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  RotateCcw,
  Building,
  Check,
  ChevronDown,
  User,
  ExternalLink,
} from 'lucide-react';
import { usePG } from '../../context/PGContext';
import { ConfirmModal } from '../common/ConfirmModal';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    settings,
    searchQuery,
    setSearchQuery,
    notifications,
    setIsNotificationsOpen,
    resetDemoData,
    setActiveTab,
    setIsRecordPaymentOpen,
  } = usePG();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="app-header">
        <div className="header-left">
          {/* Mobile Hamburger */}
          <button
            onClick={onToggleMobileMenu}
            className="btn-icon"
            style={{ display: 'none' }}
            id="mobile-menu-btn"
          >
            <Menu size={20} />
          </button>

          {/* Property Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 12px',
                fontSize: '13px',
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
              }}
            >
              <Building size={16} color="var(--color-primary)" />
              <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{settings.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: '6px' }}>
                  ({settings.branch})
                </span>
              </div>
              <ChevronDown size={14} color="var(--color-text-muted)" />
            </button>

            {propertyDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  width: '260px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 60,
                  padding: '6px',
                }}
              >
                <div style={{ padding: '8px 10px', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                  Select Property
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <div>
                    <div>Mauli PG (Main Branch)</div>
                    <div style={{ fontSize: '11px', fontWeight: 400, color: 'var(--color-text-muted)' }}>
                      Plot 42, Shivaji Nagar
                    </div>
                  </div>
                  <Check size={16} />
                </div>

                <div
                  style={{
                    padding: '8px 10px',
                    marginTop: '4px',
                    fontSize: '12px',
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid var(--color-border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>Branch 2 (Kothrud)</span>
                  <span style={{ fontSize: '10px', backgroundColor: '#e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>
                    Coming Soon
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Global Search */}
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tenants, rooms, beds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          {/* Quick Record Payment */}
          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="btn btn-subtle btn-sm"
            style={{ fontWeight: 600 }}
          >
            Record Payment
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="btn btn-outline btn-sm"
            title="Reset all demo records back to initial sample state"
            style={{ color: 'var(--color-accent)', borderColor: 'var(--color-accent-border)' }}
          >
            <RotateCcw size={14} />
            <span style={{ fontSize: '12px' }}>Reset Data</span>
          </button>

          {/* Notifications Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="btn-icon"
              title="Notifications"
              style={{ position: 'relative' }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '18px',
                    height: '18px',
                    backgroundColor: 'var(--color-accent)',
                    color: '#ffffff',
                    borderRadius: '50%',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Owner Profile Pill */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 4px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '12px',
                }}
              >
                KP
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                  {settings.ownerName}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>PG Owner</div>
              </div>
              <ChevronDown size={13} color="var(--color-text-muted)" />
            </button>

            {profileDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '210px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 60,
                  padding: '6px',
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px' }}>{settings.ownerName}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{settings.contactPhone}</div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileDropdownOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12.5px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--color-text-main)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <User size={15} />
                  <span>PG Settings & Rules</span>
                </button>

                <div
                  style={{
                    padding: '8px 10px',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    borderTop: '1px solid var(--color-border-light)',
                  }}
                >
                  Role: Master Administrator
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={() => {
          resetDemoData();
          setIsResetConfirmOpen(false);
        }}
        title="Reset Demo Records?"
        message="This will reset all tenants, rooms, beds, bills, and deposit calculations back to the original sample scenario. Any mock payments or tenants you created will be reset."
        confirmText="Reset to Seed Data"
        cancelText="Keep Current State"
        type="warning"
      />
    </>
  );
};
