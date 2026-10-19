import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import { Badge } from '../components/common/Badge';
import { BedDetailModal } from '../components/modals/BedDetailModal';
import type { BedStatus } from '../types';
import {
  BedDouble,
  Search,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Clock,
  User,
  ShieldAlert,
  ArrowRightLeft,
  Sparkles,
} from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { rooms, tenants, bills, metrics, selectedMonth, searchQuery, setSearchQuery } = usePG();

  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<BedStatus | 'all'>('all');
  const [activeBedId, setActiveBedId] = useState<string | null>(null);

  // Available floors
  const floors = [1, 2, 3];

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    if (selectedFloor !== 'all' && room.floor !== selectedFloor) return false;

    // Search query matches room number or any occupant in this room
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const roomMatch = room.roomNumber.toLowerCase().includes(q);
      const tenantMatch = room.beds.some((b) => {
        if (!b.currentTenantId) return false;
        const t = tenants.find((item) => item.id === b.currentTenantId);
        return t && t.name.toLowerCase().includes(q);
      });
      if (!roomMatch && !tenantMatch) return false;
    }

    // Filter by bed status if active
    if (selectedStatusFilter !== 'all') {
      const hasBedWithStatus = room.beds.some((b) => b.status === selectedStatusFilter);
      if (!hasBedWithStatus) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
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
            Rooms & Beds — Interactive Occupancy Map
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Visual floor layout with real-time bed availability, occupant records, and shift actions.
          </p>
        </div>

        {/* Status Count Pill Summary */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-occupied-bg)',
              color: 'var(--status-occupied)',
              border: '1px solid var(--color-primary-border)',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            Occupied: {metrics.occupiedBedsCount}
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-available-bg)',
              color: 'var(--status-available)',
              border: '1px solid #86efac',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            Available: {metrics.availableBedsCount}
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-notice-bg)',
              color: 'var(--status-notice)',
              border: '1px solid var(--color-accent-border)',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            Notice: {metrics.noticeBedsCount}
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-reserved-bg)',
              color: 'var(--status-reserved)',
              border: '1px solid #fde68a',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            Reserved: {metrics.reservedBedsCount}
          </div>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--status-maintenance-bg)',
              color: 'var(--status-maintenance)',
              border: '1px solid #cbd5e1',
              fontSize: '12.5px',
              fontWeight: 600,
            }}
          >
            Maintenance: {metrics.maintenanceBedsCount}
          </div>
        </div>
      </div>

      {/* Filter and Legend Bar */}
      <div
        className="card"
        style={{
          padding: '16px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', width: '100%' }}>
          {/* Floor Tabs */}
          <div className="filter-tabs" style={{ maxWidth: '100%', overflowX: 'auto', paddingBottom: '2px' }}>
            <button
              onClick={() => setSelectedFloor('all')}
              className={`filter-tab ${selectedFloor === 'all' ? 'active' : ''}`}
            >
              All Floors (8 Rooms)
            </button>
            {floors.map((fl) => (
              <button
                key={fl}
                onClick={() => setSelectedFloor(fl)}
                className={`filter-tab ${selectedFloor === fl ? 'active' : ''}`}
              >
                Floor {fl}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            className="form-select"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            style={{ minWidth: '160px', flex: '1 1 auto', padding: '8px 10px', fontSize: '12.5px', minHeight: '38px' }}
          >
            <option value="all">All Bed Statuses</option>
            <option value="available">Available Beds Only</option>
            <option value="occupied">Occupied Beds Only</option>
            <option value="notice">Notice Given Only</option>
            <option value="reserved">Reserved Only</option>
            <option value="maintenance">Maintenance Only</option>
          </select>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} />
            <span>Occupied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
            <span>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
            <span>Notice</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
            <span>Reserved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-maintenance)' }} />
            <span>Maintenance</span>
          </div>
        </div>
      </div>

      {/* Floor by Floor Layout Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {floors
          .filter((fl) => selectedFloor === 'all' || selectedFloor === fl)
          .map((floorNum) => {
            const floorRooms = filteredRooms.filter((r) => r.floor === floorNum);
            if (floorRooms.length === 0) return null;

            return (
              <div key={floorNum}>
                {/* Floor Header Label */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '14px',
                  }}
                >
                  <div
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      padding: '3px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                    }}
                  >
                    FLOOR {floorNum}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    {floorRooms.length} Rooms • {floorRooms.flatMap((r) => r.beds).length} Total Beds
                  </div>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
                </div>

                {/* Rooms Grid for this floor */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                    gap: '16px',
                  }}
                >
                  {floorRooms.map((room) => {
                    return (
                      <div
                        key={room.id}
                        className="card"
                        style={{
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          borderTop: '3px solid var(--color-primary)',
                        }}
                      >
                        {/* Room Info Header */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-primary)' }}>
                                  Room {room.roomNumber}
                                </h3>
                                <span
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    backgroundColor: 'var(--color-bg-subtle)',
                                    padding: '2px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--color-text-muted)',
                                  }}
                                >
                                  {room.type} sharing
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                                {room.hasAttachedBath ? 'Attached Bath' : 'Common Bath'} • {room.hasAC ? 'AC Room' : 'Non-AC'} • ₹{room.baseMonthlyRent.toLocaleString('en-IN')}/mo
                              </div>
                            </div>
                          </div>

                          {/* Beds Grid inside Room */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                            {room.beds.map((bed) => {
                              const tenant = bed.currentTenantId
                                ? tenants.find((t) => t.id === bed.currentTenantId)
                                : null;
                              const currentBill = tenant
                                ? bills.find((b) => b.tenantId === tenant.id && b.monthYear === selectedMonth)
                                : null;

                              return (
                                <div
                                  key={bed.id}
                                  onClick={() => setActiveBedId(bed.id)}
                                  style={{
                                    padding: '10px 12px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor:
                                      bed.status === 'occupied'
                                        ? 'var(--status-occupied-bg)'
                                        : bed.status === 'available'
                                        ? 'var(--status-available-bg)'
                                        : bed.status === 'notice'
                                        ? 'var(--status-notice-bg)'
                                        : bed.status === 'reserved'
                                        ? 'var(--status-reserved-bg)'
                                        : 'var(--status-maintenance-bg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'none';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div
                                      style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '6px',
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary)',
                                        border: '1px solid var(--color-border)',
                                      }}
                                    >
                                      <BedDouble size={16} />
                                    </div>

                                    <div>
                                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                                        {bed.bedLabel}
                                      </div>
                                      {tenant ? (
                                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                                          {tenant.name}
                                        </div>
                                      ) : bed.status === 'maintenance' ? (
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                                          {bed.maintenanceReason || 'Maintenance in progress'}
                                        </div>
                                      ) : (
                                        <div style={{ fontSize: '11.5px', color: 'var(--color-success)', fontWeight: 500 }}>
                                          Vacant & Ready
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div style={{ textAlign: 'right' }}>
                                    <Badge type="bed" status={bed.status} />
                                    {currentBill && currentBill.outstandingAmount > 0 && (
                                      <div style={{ fontSize: '10.5px', color: 'var(--color-accent)', fontWeight: 700, marginTop: '2px' }}>
                                        ₹{currentBill.outstandingAmount.toLocaleString('en-IN')} Due
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Room Footer Summary */}
                        <div
                          style={{
                            marginTop: '16px',
                            paddingTop: '10px',
                            borderTop: '1px solid var(--color-border-light)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '11.5px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <span>
                            {room.beds.filter((b) => b.status === 'occupied').length} Occupied / {room.beds.length} Total
                          </span>
                          <span style={{ color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                            Click bed to inspect &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Bed Details Modal */}
      <BedDetailModal
        isOpen={!!activeBedId}
        onClose={() => setActiveBedId(null)}
        bedId={activeBedId}
      />
    </div>
  );
};
