import React from 'react';
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

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        style={{
          width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
          backgroundColor: '#ffffff',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 46,
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s ease',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            padding: collapsed ? '0 16px' : '0 20px',
            borderBottom: '1px solid var(--color-border)',
            gap: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
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
            <Building2 size={22} />
          </div>

          {!collapsed && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '17px',
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

        {/* Quick Add Action */}
        {!collapsed && (
          <div style={{ padding: '16px 16px 8px 16px' }}>
            <button
              onClick={() => setIsAddTenantOpen(true)}
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
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: collapsed ? '12px 0' : '10px 14px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
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
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                      e.currentTarget.style.color = 'var(--color-text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-muted)';
                    }
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
                  {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
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
            onClick={() => setIsQuickTourOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '10px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-primary-light)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="How to use this demo"
          >
            <HelpCircle size={18} />
            {!collapsed && <span>Demo Guide</span>}
          </button>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '10px 0' : '8px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: 'transparent',
              color: 'var(--color-accent)',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            title="Leave feedback or requested changes"
          >
            <MessageSquare size={18} />
            {!collapsed && <span>Client Feedback</span>}
          </button>

          {/* Desktop collapse toggle */}
          <div
            style={{
              display: 'flex',
              justifyContent: collapsed ? 'center' : 'flex-end',
              paddingTop: '6px',
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
