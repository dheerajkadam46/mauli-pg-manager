import React, { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BedDouble,
  Receipt,
  ShieldCheck,
  ArrowRightLeft,
  BarChart3,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  HelpCircle,
  MessageSquare,
  X,
} from 'lucide-react';
import { usePG } from '../../context/PGContext';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activeTab, setActiveTab, setIsAddTenantOpen, setIsQuickTourOpen, setIsFeedbackOpen } = usePG();

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen, setMobileOpen]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'rooms', label: 'Rooms & Beds', icon: BedDouble },
    { id: 'bills', label: 'Rent & Bills', icon: Receipt },
    { id: 'deposits', label: 'Security Deposits', icon: ShieldCheck },
    { id: 'lifecycle', label: 'Move-in / Move-out', icon: ArrowRightLeft },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  const handleOpenAddTenant = () => {
    setIsAddTenantOpen(true);
    setMobileOpen(false);
  };

  const handleOpenQuickTour = () => {
    setIsQuickTourOpen(true);
    setMobileOpen(false);
  };

  const handleOpenFeedback = () => {
    setIsFeedbackOpen(true);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop (only rendered when mobile drawer is open) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="app-sidebar-backdrop"
          aria-label="Close navigation drawer"
        />
      )}

      <aside
        className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: collapsed ? '0 16px' : '0 18px',
            borderBottom: '1px solid var(--color-border)',
            gap: '12px',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(27,67,50,0.25)',
              }}
            >
              <Building2 size={20} />
            </div>

            {(!collapsed || mobileOpen) && (
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '16px',
                    fontWeight: 700,
                    color: 'var(--color-primary)',
                    letterSpacing: '-0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Mauli PG Manager
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Shivaji Nagar, Pune
                </div>
              </div>
            )}
          </div>

          {/* Close button for Mobile Drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="btn-icon sidebar-mobile-close-btn"
            style={{ display: 'none' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Add Action (Visible when expanded or on mobile) */}
        {(!collapsed || mobileOpen) && (
          <div style={{ padding: '14px 14px 6px 14px' }}>
            <button
              onClick={handleOpenAddTenant}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '9px 12px',
                fontSize: '13px',
                boxShadow: '0 2px 4px rgba(27,67,50,0.2)',
              }}
            >
              <PlusCircle size={17} />
              <span>Add Tenant</span>
            </button>
          </div>
        )}

        {/* Navigation List */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const showText = !collapsed || mobileOpen;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={!showText ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: !showText ? '12px 0' : '10px 14px',
                    justifyContent: !showText ? 'center' : 'flex-start',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: isActive ? 'var(--color-primary-subtle)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13.5px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                    minHeight: '42px',
                  }}
                >
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '15%',
                        height: '70%',
                        width: '3.5px',
                        backgroundColor: 'var(--color-primary)',
                        borderRadius: '0 4px 4px 0',
                      }}
                    />
                  )}
                  <Icon size={19} color={isActive ? 'var(--color-primary)' : 'currentColor'} />
                  {showText && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer Actions (Client Tour & Feedback) */}
        <div
          style={{
            padding: '12px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            backgroundColor: '#fdfcfb',
          }}
        >
          <button
            onClick={handleOpenQuickTour}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: (!collapsed || mobileOpen) ? '8px 12px' : '10px 0',
              justifyContent: (!collapsed || mobileOpen) ? 'flex-start' : 'center',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-primary-light)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '38px',
            }}
            title="How to use this demo"
          >
            <HelpCircle size={18} />
            {(!collapsed || mobileOpen) && <span>Demo Guide</span>}
          </button>

          <button
            onClick={handleOpenFeedback}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: (!collapsed || mobileOpen) ? '8px 12px' : '10px 0',
              justifyContent: (!collapsed || mobileOpen) ? 'flex-start' : 'center',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-accent)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              minHeight: '38px',
            }}
            title="Leave feedback or requested changes"
          >
            <MessageSquare size={18} />
            {(!collapsed || mobileOpen) && <span>Client Feedback</span>}
          </button>

          {/* Desktop collapse toggle (hidden on mobile) */}
          <div
            className="sidebar-collapse-btn"
            style={{
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-end',
              paddingTop: '4px',
            }}
          >
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="btn-icon"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{ padding: '6px' }}
            >
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
