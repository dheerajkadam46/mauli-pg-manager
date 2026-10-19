import React from 'react';
import { usePG } from '../../context/PGContext';
import { X, Bell, AlertTriangle, Info, Check, CheckCheck } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
  } = usePG();

  if (!isNotificationsOpen) return null;

  const handleAction = (route?: string, id?: string) => {
    if (id) markNotificationRead(id);
    if (route) setActiveTab(route);
    setIsNotificationsOpen(false);
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsNotificationsOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fbfaf8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--color-primary)', margin: 0 }}>
                Notifications & Alerts
              </h3>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Tenant dues, upcoming move-outs & reminders
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllNotificationsRead}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              title="Mark all as read"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
            <button onClick={() => setIsNotificationsOpen(false)} className="btn-icon">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleAction(notif.actionRoute, notif.id)}
                style={{
                  padding: '14px',
                  backgroundColor: notif.read ? '#ffffff' : '#f0fdf4',
                  border: `1px solid ${notif.read ? 'var(--color-border)' : 'var(--color-primary-border)'}`,
                  borderRadius: 'var(--radius-md)',
                  cursor: notif.actionRoute ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {!notif.read && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                    }}
                  />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px', color: notif.type === 'warning' ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                    {notif.type === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                      {notif.title}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--color-text-main)', marginTop: '2px', lineHeight: 1.4 }}>
                      {notif.message}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        fontSize: '11px',
                        color: 'var(--color-text-light)',
                      }}
                    >
                      <span>{notif.timestamp}</span>
                      {notif.actionRoute && (
                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                          View Module &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
