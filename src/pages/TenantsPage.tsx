import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { Badge } from '../components/common/Badge';
import { TenantProfileDrawer } from '../components/modals/TenantProfileDrawer';
import {
  Search,
  PlusCircle,
  Eye,
  DollarSign,
  Phone,
  Building,
  Calendar,
} from 'lucide-react';

export const TenantsPage: React.FC = () => {
  const {
    tenants,
    bills,
    setIsAddTenantOpen,
    searchQuery,
    setSearchQuery,
    selectedMonth,
    setSelectedBillId,
    setIsRecordPaymentOpen,
  } = usePG();

  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'notice' | 'checked_out'>('all');
  const [rentFilter, setRentFilter] = useState<'all' | 'paid' | 'partially_paid' | 'overdue'>('all');
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Filter tenants based on search, status, and rent status
  const filteredTenants = tenants.filter((tenant) => {
    // Search query
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.phone.includes(searchQuery) ||
      tenant.roomNumber.includes(searchQuery) ||
      tenant.bedId.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Tenancy Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && tenant.status !== 'active' && tenant.status !== 'upcoming_checkout') return false;
      if (statusFilter === 'notice' && tenant.status !== 'notice') return false;
      if (statusFilter === 'checked_out' && tenant.status !== 'checked_out') return false;
    }

    // Rent Status filter
    if (rentFilter !== 'all') {
      const currentBill = bills.find((b) => b.tenantId === tenant.id && b.monthYear === selectedMonth);
      if (!currentBill) return false;
      if (currentBill.status !== rentFilter) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Tenant Management
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Occupant directory, room assignments & rent dues
          </p>
        </div>

        <button
          onClick={() => setIsAddTenantOpen(true)}
          className="btn btn-primary"
          style={{ fontSize: '13px', padding: '8px 14px' }}
        >
          <PlusCircle size={16} />
          <span>Add New Tenant</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div
        className="card"
        style={{
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Filter Tabs (Scrolls horizontally on mobile) */}
          <div className="filter-tabs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
            >
              All ({tenants.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
            >
              Active ({tenants.filter((t) => t.status === 'active' || t.status === 'upcoming_checkout').length})
            </button>
            <button
              onClick={() => setStatusFilter('notice')}
              className={`filter-tab ${statusFilter === 'notice' ? 'active' : ''}`}
            >
              On Notice ({tenants.filter((t) => t.status === 'notice').length})
            </button>
            <button
              onClick={() => setStatusFilter('checked_out')}
              className={`filter-tab ${statusFilter === 'checked_out' ? 'active' : ''}`}
            >
              Past ({tenants.filter((t) => t.status === 'checked_out').length})
            </button>
          </div>

          {/* Rent Status Filter */}
          <select
            className="form-select"
            value={rentFilter}
            onChange={(e) => setRentFilter(e.target.value as any)}
            style={{ width: 'auto', minWidth: '150px', padding: '6px 10px', fontSize: '12.5px', height: '36px' }}
          >
            <option value="all">Rent: All</option>
            <option value="paid">Rent: Paid</option>
            <option value="partially_paid">Rent: Partial</option>
            <option value="overdue">Rent: Overdue</option>
          </select>
        </div>

        {/* Search Input (Full width on mobile) */}
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, room, bed, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '32px', fontSize: '13px', height: '38px' }}
          />
        </div>
      </div>

      {/* MOBILE VIEW: Stacked Tenant Cards (Visible on screens <= 767px) */}
      <div className="mobile-card-list">
        {filteredTenants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            No tenants matching the current search or filters.
          </div>
        ) : (
          filteredTenants.map((tenant) => {
            const currentBill = bills.find((b) => b.tenantId === tenant.id && b.monthYear === selectedMonth);

            return (
              <div key={tenant.id} className="mobile-data-card">
                <div className="mobile-data-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-subtle)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        flexShrink: 0,
                      }}
                    >
                      {tenant.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        onClick={() => setActiveProfileId(tenant.id)}
                        style={{
                          fontWeight: 700,
                          fontSize: '14px',
                          color: 'var(--color-primary)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tenant.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {tenant.phone}
                      </div>
                    </div>
                  </div>

                  <Badge type="tenancy" status={tenant.status} />
                </div>

                <div className="mobile-data-card-grid">
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Room & Bed:</span>
                    <strong style={{ display: 'block', color: 'var(--color-text-main)', marginTop: '1px' }}>
                      Room {tenant.roomNumber} ({tenant.bedId})
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Monthly Rent:</span>
                    <strong style={{ display: 'block', color: 'var(--color-text-main)', marginTop: '1px' }}>
                      ₹{tenant.monthlyRent.toLocaleString('en-IN')}/mo
                    </strong>
                  </div>

                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Joining Date:</span>
                    <div style={{ color: 'var(--color-text-main)', marginTop: '1px' }}>
                      {tenant.joiningDate}
                    </div>
                  </div>

                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Rent Status ({selectedMonth.split(' ')[0]}):</span>
                    <div style={{ marginTop: '2px' }}>
                      {currentBill ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                          <Badge type="bill" status={currentBill.status} />
                          {currentBill.outstandingAmount > 0 && (
                            <span style={{ fontSize: '11px', color: 'var(--color-accent)', fontWeight: 700 }}>
                              ₹{currentBill.outstandingAmount.toLocaleString('en-IN')} due
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)' }}>N/A</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mobile-data-card-actions">
                  {currentBill && currentBill.outstandingAmount > 0 && (
                    <button
                      onClick={() => {
                        setSelectedBillId(currentBill.id);
                        setIsRecordPaymentOpen(true);
                      }}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <DollarSign size={14} />
                      <span>Collect Rent</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveProfileId(tenant.id)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    <Eye size={14} />
                    <span>View Profile</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DESKTOP VIEW: Full Data Table (Visible on screens >= 768px) */}
      <div className="table-container desktop-table-container">
        <table>
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Phone Number</th>
              <th>Room & Bed</th>
              <th>Joining Date</th>
              <th>Monthly Rent</th>
              <th>Rent Status ({selectedMonth.split(' ')[0]})</th>
              <th>Tenancy Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--color-text-muted)' }}>
                  No tenants matching the current search or filters.
                </td>
              </tr>
            ) : (
              filteredTenants.map((tenant) => {
                const currentBill = bills.find((b) => b.tenantId === tenant.id && b.monthYear === selectedMonth);

                return (
                  <tr key={tenant.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-primary-subtle)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '12px',
                          }}
                        >
                          {tenant.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div
                            onClick={() => setActiveProfileId(tenant.id)}
                            style={{
                              fontWeight: 600,
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              textUnderlineOffset: '2px',
                            }}
                          >
                            {tenant.name}
                          </div>
                          {tenant.workOrCollege && (
                            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {tenant.workOrCollege}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px' }}>{tenant.phone}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13px' }}>
                        Room {tenant.roomNumber}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                        {tenant.bedId} (Floor {tenant.floor})
                      </div>
                    </td>

                    <td style={{ fontSize: '12.5px' }}>{tenant.joiningDate}</td>

                    <td>
                      <strong style={{ fontSize: '13.5px' }}>₹{tenant.monthlyRent.toLocaleString('en-IN')}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>incl. meals</div>
                    </td>

                    <td>
                      {currentBill ? (
                        <div>
                          <Badge type="bill" status={currentBill.status} />
                          {currentBill.outstandingAmount > 0 && (
                            <div style={{ fontSize: '11px', color: 'var(--color-accent)', marginTop: '2px', fontWeight: 600 }}>
                              ₹{currentBill.outstandingAmount.toLocaleString('en-IN')} pending
                            </div>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>N/A</span>
                      )}
                    </td>

                    <td>
                      <Badge type="tenancy" status={tenant.status} />
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => setActiveProfileId(tenant.id)}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '4px 8px', fontSize: '12px' }}
                          title="View Full Profile"
                        >
                          <Eye size={13} />
                          <span>Profile</span>
                        </button>

                        {currentBill && currentBill.outstandingAmount > 0 && (
                          <button
                            onClick={() => {
                              setSelectedBillId(currentBill.id);
                              setIsRecordPaymentOpen(true);
                            }}
                            className="btn btn-subtle btn-sm"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                            title="Collect Payment"
                          >
                            <DollarSign size={13} />
                            <span>Collect</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tenant Profile Drawer */}
      <TenantProfileDrawer
        isOpen={!!activeProfileId}
        onClose={() => setActiveProfileId(null)}
        tenantId={activeProfileId}
      />
    </div>
  );
};
