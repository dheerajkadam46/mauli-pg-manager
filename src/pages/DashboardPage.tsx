import React from 'react';
import { usePG } from '../context/PGContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Users,
  BedDouble,
  Receipt,
  IndianRupee,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  LogOut,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    metrics,
    setActiveTab,
    setIsAddTenantOpen,
    setIsRecordPaymentOpen,
    setIsCheckoutWizardOpen,
    bills,
    tenants,
    selectedMonth,
    setSelectedBillId,
    setSelectedReceiptBill,
  } = usePG();

  // Filter bills for selected month
  const currentMonthBills = bills.filter((b) => b.monthYear === selectedMonth);
  const pendingBills = currentMonthBills.filter((b) => b.outstandingAmount > 0);
  const recentPayments = currentMonthBills
    .flatMap((b) => b.payments)
    .sort((a, b) => b.id.localeCompare(a.id))
    .slice(0, 5);

  const upcomingDepartures = tenants.filter(
    (t) => t.status === 'notice' || t.status === 'upcoming_checkout'
  );

  // Simulated 6-month collection trend data
  const monthlyTrends = [
    { month: 'May', billed: 48000, collected: 48000 },
    { month: 'Jun', billed: 54000, collected: 54000 },
    { month: 'Jul', billed: 54000, collected: 51000 },
    { month: 'Aug', billed: 60000, collected: 60000 },
    { month: 'Sep', billed: 67500, collected: 67500 },
    { month: 'Oct', billed: metrics.billedThisMonth, collected: metrics.collectedThisMonth, isCurrent: true },
  ];

  const maxBilled = Math.max(...monthlyTrends.map((m) => m.billed), 70000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      {/* Top Banner / Welcome Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1 style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Property Overview
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Live occupancy & rent collections for <strong>Mauli PG (Main Branch)</strong>
          </p>
        </div>

        {/* Quick Actions Toolbar - Mobile-optimized Grid/Toolbar */}
        <div className="dashboard-quick-actions">
          <button
            onClick={() => setIsAddTenantOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '12.5px', padding: '7px 12px', minHeight: '38px' }}
          >
            <PlusCircle size={15} />
            <span>Add Tenant</span>
          </button>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="btn btn-outline"
            style={{ fontSize: '12.5px', padding: '7px 12px', minHeight: '38px' }}
          >
            <Receipt size={15} />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className="btn btn-outline"
            style={{ fontSize: '12.5px', padding: '7px 12px', minHeight: '38px' }}
          >
            <BedDouble size={15} />
            <span>View Occupancy</span>
          </button>

          <button
            onClick={() => setIsCheckoutWizardOpen(true)}
            className="btn btn-outline"
            style={{
              fontSize: '12.5px',
              padding: '7px 12px',
              minHeight: '38px',
              color: 'var(--color-accent)',
              borderColor: 'var(--color-accent-border)',
            }}
          >
            <LogOut size={15} />
            <span>Start Checkout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid (Responsive: 2-col on mobile, 1-col on <=340px, auto-fit on desktop) */}
      <div className="grid-kpi-cards">
        <StatCard
          label="Active Tenants"
          value={metrics.activeTenantsCount}
          subtext={`Across ${metrics.totalRoomsCount} rooms`}
          icon={Users}
          onClick={() => setActiveTab('tenants')}
        />

        <StatCard
          label="Occupied Beds"
          value={`${metrics.occupiedBedsCount} / ${metrics.totalBedsCount}`}
          subtext={`${metrics.occupancyRate}% Occupancy`}
          icon={BedDouble}
          iconBgColor="var(--status-occupied-bg)"
          iconColor="var(--status-occupied)"
          onClick={() => setActiveTab('rooms')}
        />

        <StatCard
          label="Vacant Beds"
          value={metrics.availableBedsCount}
          subtext={`${metrics.reservedBedsCount} res, ${metrics.maintenanceBedsCount} maint`}
          icon={CheckCircle}
          iconBgColor="var(--status-available-bg)"
          iconColor="var(--status-available)"
          onClick={() => setActiveTab('rooms')}
        />

        <StatCard
          label={`Rent Collected (${selectedMonth.split(' ')[0]})`}
          value={`₹${metrics.collectedThisMonth.toLocaleString('en-IN')}`}
          subtext={`of ₹${metrics.billedThisMonth.toLocaleString('en-IN')} billed`}
          icon={IndianRupee}
          iconBgColor="var(--status-available-bg)"
          iconColor="var(--status-available)"
          onClick={() => setActiveTab('bills')}
        />

        <StatCard
          label="Outstanding Rent"
          value={`₹${metrics.outstandingThisMonth.toLocaleString('en-IN')}`}
          subtext={`${pendingBills.length} pending dues`}
          icon={AlertTriangle}
          iconBgColor="#fee2e2"
          iconColor="var(--color-danger)"
          accent={metrics.outstandingThisMonth > 0}
          onClick={() => setActiveTab('bills')}
        />

        <StatCard
          label="Upcoming Move-Outs"
          value={metrics.upcomingMoveOutsCount}
          subtext="15-day notice active"
          icon={ArrowRightLeft}
          iconBgColor="var(--status-notice-bg)"
          iconColor="var(--status-notice)"
          onClick={() => setActiveTab('lifecycle')}
        />
      </div>

      {/* Main Charts & Highlights Split (Stacks vertically on mobile) */}
      <div className="grid-dashboard-split">
        {/* Monthly Collection Trend Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '16px' }}>Rent Collection Trend</h3>
              <p className="card-subtitle">Billed vs Realized Cash Collections</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
                <span>Collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                <span>Billed</span>
              </div>
            </div>
          </div>

          {/* Responsive Bar Chart */}
          <div style={{ marginTop: '16px', overflowX: 'auto', paddingBottom: '6px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                height: '170px',
                gap: '8px',
                minWidth: '280px',
              }}
            >
              {monthlyTrends.map((t) => {
                const billedHeight = Math.round((t.billed / maxBilled) * 140);
                const collectedHeight = Math.round((t.collected / maxBilled) * 140);

                return (
                  <div
                    key={t.month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                      ₹{(t.collected / 1000).toFixed(0)}k
                    </div>

                    <div
                      style={{
                        width: '100%',
                        maxWidth: '40px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        position: 'relative',
                        height: '130px',
                      }}
                    >
                      {/* Billed bar (background) */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          width: '100%',
                          height: `${billedHeight}px`,
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px 3px 0 0',
                        }}
                      />
                      {/* Collected bar (foreground) */}
                      <div
                        style={{
                          position: 'relative',
                          width: '75%',
                          height: `${collectedHeight}px`,
                          backgroundColor: t.isCurrent ? 'var(--color-primary)' : 'var(--color-primary-light)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 0.4s ease',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: t.isCurrent ? 700 : 500,
                        color: t.isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      {t.month}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Move-outs Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '16px' }}>Upcoming Move-Outs</h3>
              <p className="card-subtitle">Active 15-day departures</p>
            </div>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
            >
              Pipeline &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcomingDepartures.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
                No active move-out notices pending.
              </div>
            ) : (
              upcomingDepartures.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Room {t.roomNumber} ({t.bedId})
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-accent)', marginTop: '2px', fontWeight: 600 }}>
                      Exit: {t.intendedDepartureDate}
                    </div>
                  </div>

                  <button
                    onClick={() => setIsCheckoutWizardOpen(true)}
                    className="btn btn-accent btn-sm"
                    style={{ fontSize: '11.5px', padding: '5px 10px', flexShrink: 0 }}
                  >
                    Checkout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Dues vs Payments Split (Stacks vertically on mobile) */}
      <div className="grid-dashboard-dues-split">
        {/* Pending & Overdue Rent List */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '16px' }}>Pending Rent ({selectedMonth.split(' ')[0]})</h3>
              <p className="card-subtitle">Unpaid balances requiring follow-up</p>
            </div>
            <button
              onClick={() => setActiveTab('bills')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
            >
              All Bills &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingBills.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-success)', fontSize: '13px' }}>
                All rent bills for {selectedMonth} have been cleared!
              </div>
            ) : (
              pendingBills.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    gap: '10px',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.tenantName}
                      </span>
                      <Badge type="bill" status={b.status} />
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Room {b.roomNumber} ({b.bedId}) • Due: {b.dueDate}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-accent)' }}>
                      ₹{b.outstandingAmount.toLocaleString('en-IN')}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBillId(b.id);
                        setIsRecordPaymentOpen(true);
                      }}
                      className="btn btn-subtle btn-sm"
                      style={{ marginTop: '4px', fontSize: '11px', padding: '3px 8px' }}
                    >
                      Collect
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payment Activity */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '16px' }}>Recent Rent Collections</h3>
              <p className="card-subtitle">Real-time payment audit log</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
            >
              Report &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPayments.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '12.5px' }}>
                No recent payments recorded.
              </div>
            ) : (
              recentPayments.map((p) => {
                const parentBill = bills.find((b) => b.id === p.billId);
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                      gap: '10px',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.tenantName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {p.date} • <span style={{ fontWeight: 600 }}>{p.method}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-success)' }}>
                        +₹{p.amount.toLocaleString('en-IN')}
                      </div>
                      {parentBill && (
                        <button
                          onClick={() => setSelectedReceiptBill(parentBill)}
                          className="btn btn-outline btn-sm"
                          style={{ marginTop: '4px', fontSize: '10.5px', padding: '2px 7px' }}
                        >
                          Receipt
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
