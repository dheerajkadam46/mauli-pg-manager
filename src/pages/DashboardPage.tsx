import React from 'react';
import { usePG } from '../context/PGContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import {
  Users,
  BedDouble,
  Receipt,
  IndianRupee,
  Clock,
  ArrowRightLeft,
  CheckCircle,
  AlertTriangle,
  PlusCircle,
  Eye,
  LogOut,
  Calendar,
  TrendingUp,
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
    activityLogs,
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

  const recentMoveIns = tenants
    .filter((t) => t.status !== 'checked_out')
    .slice(0, 4);

  // Simulated 6-month collection trend data
  const monthlyTrends = [
    { month: 'May', billed: 48000, collected: 48000 },
    { month: 'Jun', billed: 54000, collected: 54000 },
    { month: 'Jul', billed: 54000, collected: 51000 },
    { month: 'Aug', billed: 60000, collected: 60000 },
    { month: 'Sep', billed: 67500, collected: 67500 },
    { month: 'Oct (Current)', billed: metrics.billedThisMonth, collected: metrics.collectedThisMonth },
  ];

  const maxBilled = Math.max(...monthlyTrends.map((m) => m.billed), 70000);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Welcome Row */}
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
            Property Overview
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Live occupancy, monthly rent collections, and departures for <strong>Mauli PG (Main Branch)</strong>
          </p>
        </div>

        {/* Quick Actions Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button
            onClick={() => setIsAddTenantOpen(true)}
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <PlusCircle size={16} />
            <span>Add Tenant</span>
          </button>

          <button
            onClick={() => setIsRecordPaymentOpen(true)}
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <Receipt size={16} />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveTab('rooms')}
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '8px 14px' }}
          >
            <BedDouble size={16} />
            <span>View Occupancy</span>
          </button>

          <button
            onClick={() => setIsCheckoutWizardOpen(true)}
            className="btn btn-outline"
            style={{ fontSize: '13px', padding: '8px 14px', color: 'var(--color-accent)' }}
          >
            <LogOut size={16} />
            <span>Start Checkout</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
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
          subtext={`${metrics.occupancyRate}% Total Occupancy`}
          icon={BedDouble}
          iconBgColor="var(--status-occupied-bg)"
          iconColor="var(--status-occupied)"
          onClick={() => setActiveTab('rooms')}
        />

        <StatCard
          label="Available Vacant Beds"
          value={metrics.availableBedsCount}
          subtext={`${metrics.reservedBedsCount} reserved, ${metrics.maintenanceBedsCount} maintenance`}
          icon={CheckCircle}
          iconBgColor="var(--status-available-bg)"
          iconColor="var(--status-available)"
          onClick={() => setActiveTab('rooms')}
        />

        <StatCard
          label={`Rent Collected (${selectedMonth.split(' ')[0]})`}
          value={`₹${metrics.collectedThisMonth.toLocaleString('en-IN')}`}
          subtext={`of ₹${metrics.billedThisMonth.toLocaleString('en-IN')} total billed`}
          icon={IndianRupee}
          iconBgColor="var(--status-available-bg)"
          iconColor="var(--status-available)"
          onClick={() => setActiveTab('bills')}
        />

        <StatCard
          label="Outstanding Rent"
          value={`₹${metrics.outstandingThisMonth.toLocaleString('en-IN')}`}
          subtext={`${pendingBills.length} pending tenant dues`}
          icon={AlertTriangle}
          iconBgColor="#fee2e2"
          iconColor="var(--color-danger)"
          accent={metrics.outstandingThisMonth > 0}
          onClick={() => setActiveTab('bills')}
        />

        <StatCard
          label="Upcoming Move-Outs"
          value={metrics.upcomingMoveOutsCount}
          subtext="Under 15-day notice period"
          icon={ArrowRightLeft}
          iconBgColor="var(--status-notice-bg)"
          iconColor="var(--status-notice)"
          onClick={() => setActiveTab('lifecycle')}
        />
      </div>

      {/* Main Charts & Highlights Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        {/* Monthly Collection Trend Bar Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Monthly Rent Collection Trend</h3>
              <p className="card-subtitle">Monthly billed vs realized cash collections (INR)</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }} />
                <span>Collected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '2px' }} />
                <span>Billed</span>
              </div>
            </div>
          </div>

          {/* Custom SVG Bar Chart */}
          <div style={{ marginTop: '20px', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', gap: '16px' }}>
              {monthlyTrends.map((t, i) => {
                const billedHeight = Math.round((t.billed / maxBilled) * 160);
                const collectedHeight = Math.round((t.collected / maxBilled) * 160);
                const isCurrent = i === monthlyTrends.length - 1;

                return (
                  <div
                    key={t.month}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      height: '100%',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
                      ₹{(t.collected / 1000).toFixed(0)}k
                    </div>

                    <div
                      style={{
                        width: '100%',
                        maxWidth: '48px',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'center',
                        position: 'relative',
                        height: '140px',
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
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                      {/* Collected bar (foreground) */}
                      <div
                        style={{
                          position: 'relative',
                          width: '80%',
                          height: `${collectedHeight}px`,
                          backgroundColor: isCurrent ? 'var(--color-primary)' : 'var(--color-primary-light)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.4s ease',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        fontSize: '11.5px',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
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

        {/* Upcoming Move-outs & Departures Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Upcoming Move-Outs</h3>
              <p className="card-subtitle">Tenants with active notices</p>
            </div>
            <button
              onClick={() => setActiveTab('lifecycle')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              View Pipeline &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingDepartures.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No active move-out notices pending.
              </div>
            ) : (
              upcomingDepartures.map((t) => (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-primary)' }}>
                      {t.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Room {t.roomNumber} ({t.bedId}) • Notice: {t.noticeDate}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--color-accent)', marginTop: '2px', fontWeight: 600 }}>
                      Departure: {t.intendedDepartureDate}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCheckoutWizardOpen(true);
                    }}
                    className="btn btn-accent btn-sm"
                    style={{ fontSize: '11.5px', padding: '5px 10px' }}
                  >
                    Checkout
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Two Columns: Pending Rent Dues vs Recent Payments */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pending & Overdue Rent List */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Pending & Overdue Rent ({selectedMonth})</h3>
              <p className="card-subtitle">Tenants with unpaid balances</p>
            </div>
            <button
              onClick={() => setActiveTab('bills')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              All Bills &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {pendingBills.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-success)', fontSize: '13px' }}>
                Awesome! All rent bills for {selectedMonth} have been cleared.
              </div>
            ) : (
              pendingBills.map((b) => (
                <div
                  key={b.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 600, fontSize: '13.5px' }}>{b.tenantName}</span>
                      <Badge type="bill" status={b.status} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Room {b.roomNumber} ({b.bedId}) • Due Date: {b.dueDate}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      Paid: ₹{b.amountPaid.toLocaleString('en-IN')} of ₹{b.billAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-accent)' }}>
                      ₹{b.outstandingAmount.toLocaleString('en-IN')} Due
                    </div>
                    <button
                      onClick={() => {
                        setSelectedBillId(b.id);
                        setIsRecordPaymentOpen(true);
                      }}
                      className="btn btn-subtle btn-sm"
                      style={{ marginTop: '6px', fontSize: '11.5px' }}
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
              <h3 className="card-title">Recent Rent Payments</h3>
              <p className="card-subtitle">Latest simulated transactions & receipts</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px' }}
            >
              Payment Log &rarr;
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentPayments.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                No recent payments recorded.
              </div>
            ) : (
              recentPayments.map((p) => {
                const parentBill = bills.find((b) => b.id === p.billId);
                return (
                  <div
                    key={p.id}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-primary)' }}>
                        {p.tenantName}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                        {p.date} • via <span style={{ fontWeight: 600 }}>{p.method}</span>
                        {p.referenceNo && ` • ${p.referenceNo.split('/')[0]}`}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-success)' }}>
                        +₹{p.amount.toLocaleString('en-IN')}
                      </div>
                      {parentBill && (
                        <button
                          onClick={() => setSelectedReceiptBill(parentBill)}
                          className="btn btn-outline btn-sm"
                          style={{ marginTop: '6px', fontSize: '11px', padding: '2px 8px' }}
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
