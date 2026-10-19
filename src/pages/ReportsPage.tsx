import React, { useState } from 'react';
import { usePG } from '../context/PGContext';
import {
  BarChart3,
  Download,
  Calendar,
  IndianRupee,
  BedDouble,
  Users,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { rooms, tenants, bills, deposits, selectedMonth } = usePG();

  const [activeReportTab, setActiveReportTab] = useState<
    'collection' | 'occupancy' | 'deposits' | 'payments'
  >('collection');

  // Helper function to export CSV
  const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      rows.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 1. Export Collection Report
  const exportCollectionCSV = () => {
    const headers = ['Tenant Name', 'Room', 'Bed', 'Month', 'Billed Amount', 'Paid Amount', 'Outstanding Amount', 'Status', 'Due Date'];
    const rows = bills.map((b) => [
      b.tenantName,
      b.roomNumber,
      b.bedId,
      b.monthYear,
      b.billAmount,
      b.amountPaid,
      b.outstandingAmount,
      b.status,
      b.dueDate,
    ]);
    downloadCSV(`Mauli_PG_Rent_Collection_${selectedMonth.replace(' ', '_')}`, [headers, ...rows]);
  };

  // 2. Export Occupancy Report
  const exportOccupancyCSV = () => {
    const headers = ['Floor', 'Room Number', 'Room Type', 'Bed ID', 'Bed Label', 'Status', 'Assigned Tenant'];
    const allBeds = rooms.flatMap((r) =>
      r.beds.map((b) => {
        const t = b.currentTenantId ? tenants.find((item) => item.id === b.currentTenantId) : null;
        return [
          r.floor,
          r.roomNumber,
          r.type,
          b.id,
          b.bedLabel,
          b.status,
          t ? t.name : 'Vacant',
        ];
      })
    );
    downloadCSV('Mauli_PG_Occupancy_Summary', [headers, ...allBeds]);
  };

  // 3. Export Deposits Report
  const exportDepositsCSV = () => {
    const headers = ['Tenant Name', 'Room', 'Bed', 'Expected Deposit', 'Received Deposit', 'Deductions', 'Refund Due', 'Refund Paid', 'Settlement Status'];
    const rows = deposits.map((d) => [
      d.tenantName,
      d.roomNumber,
      d.bedId,
      d.expectedAmount,
      d.receivedAmount,
      d.deductionAmount,
      d.refundDue,
      d.refundPaid,
      d.settlementStatus,
    ]);
    downloadCSV('Mauli_PG_Security_Deposits_Liability', [headers, ...rows]);
  };

  // 4. Export Payments History
  const exportPaymentsCSV = () => {
    const headers = ['Receipt ID', 'Date', 'Tenant Name', 'Amount (INR)', 'Payment Mode', 'Reference / UTR', 'Month'];
    const payments = bills.flatMap((b) =>
      b.payments.map((p) => [
        p.id,
        p.date,
        p.tenantName,
        p.amount,
        p.method,
        p.referenceNo || 'N/A',
        b.monthYear,
      ])
    );
    downloadCSV('Mauli_PG_All_Payments_History', [headers, ...payments]);
  };

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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-primary)' }}>
            Business Reports & Analytics
          </h1>
          <p style={{ fontSize: '13.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Comprehensive revenue summaries, bed turnover metrics, deposit liabilities, and CSV exports.
          </p>
        </div>

        {/* Global Export Trigger */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (activeReportTab === 'collection') exportCollectionCSV();
              else if (activeReportTab === 'occupancy') exportOccupancyCSV();
              else if (activeReportTab === 'deposits') exportDepositsCSV();
              else exportPaymentsCSV();
            }}
            className="btn btn-outline"
            style={{ fontSize: '13px' }}
          >
            <Download size={16} />
            <span>Export Current Table to CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          onClick={() => setActiveReportTab('collection')}
          className={`filter-tab ${activeReportTab === 'collection' ? 'active' : ''}`}
        >
          Rent Collections & Dues
        </button>
        <button
          onClick={() => setActiveReportTab('occupancy')}
          className={`filter-tab ${activeReportTab === 'occupancy' ? 'active' : ''}`}
        >
          Occupancy & Floor Summary
        </button>
        <button
          onClick={() => setActiveReportTab('deposits')}
          className={`filter-tab ${activeReportTab === 'deposits' ? 'active' : ''}`}
        >
          Deposit Liabilities & Refunds
        </button>
        <button
          onClick={() => setActiveReportTab('payments')}
          className={`filter-tab ${activeReportTab === 'payments' ? 'active' : ''}`}
        >
          Full Payment Transaction Log
        </button>
      </div>

      {/* TAB 1: Rent Collections Report */}
      {activeReportTab === 'collection' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Monthly Rent Ledger Summary</h3>
              <p className="card-subtitle">Realized income vs pending dues across active billing cycles</p>
            </div>
            <button onClick={exportCollectionCSV} className="btn btn-subtle btn-sm">
              <FileSpreadsheet size={14} />
              <span>Download Excel/CSV</span>
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Room & Bed</th>
                  <th>Cycle</th>
                  <th>Billed Amount</th>
                  <th>Amount Paid</th>
                  <th>Outstanding Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b.id}>
                    <td><strong>{b.tenantName}</strong></td>
                    <td>Room {b.roomNumber} ({b.bedId})</td>
                    <td>{b.monthYear}</td>
                    <td>₹{b.billAmount.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹{b.amountPaid.toLocaleString('en-IN')}</td>
                    <td style={{ color: b.outstandingAmount > 0 ? 'var(--color-accent)' : 'inherit', fontWeight: 600 }}>
                      ₹{b.outstandingAmount.toLocaleString('en-IN')}
                    </td>
                    <td>
                      <span className="badge" style={{ textTransform: 'capitalize' }}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Occupancy & Floor Summary */}
      {activeReportTab === 'occupancy' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Floor-Wise Bed Utilization</h3>
              <p className="card-subtitle">Occupied vs available capacity per room</p>
            </div>
            <button onClick={exportOccupancyCSV} className="btn btn-subtle btn-sm">
              <FileSpreadsheet size={14} />
              <span>Download Excel/CSV</span>
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Floor</th>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Total Beds</th>
                  <th>Occupied Beds</th>
                  <th>Available Beds</th>
                  <th>Under Notice / Maint</th>
                  <th>Occupancy %</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => {
                  const occ = r.beds.filter((b) => b.status === 'occupied').length;
                  const avail = r.beds.filter((b) => b.status === 'available').length;
                  const other = r.beds.filter((b) => b.status === 'notice' || b.status === 'maintenance' || b.status === 'reserved').length;
                  const rate = Math.round((occ / r.beds.length) * 100);

                  return (
                    <tr key={r.id}>
                      <td>Floor {r.floor}</td>
                      <td><strong>Room {r.roomNumber}</strong></td>
                      <td style={{ textTransform: 'capitalize' }}>{r.type}</td>
                      <td>{r.beds.length}</td>
                      <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{occ}</td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>{avail}</td>
                      <td>{other}</td>
                      <td>
                        <strong>{rate}%</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Deposits Liability */}
      {activeReportTab === 'deposits' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">Security Deposits & Refund Liabilities</h3>
              <p className="card-subtitle">Audited record of tenant security funds held</p>
            </div>
            <button onClick={exportDepositsCSV} className="btn btn-subtle btn-sm">
              <FileSpreadsheet size={14} />
              <span>Download Excel/CSV</span>
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Room</th>
                  <th>Expected</th>
                  <th>Received</th>
                  <th>Deductions</th>
                  <th>Refund Due</th>
                  <th>Refund Paid</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.tenantName}</strong></td>
                    <td>Room {d.roomNumber} ({d.bedId})</td>
                    <td>₹{d.expectedAmount.toLocaleString('en-IN')}</td>
                    <td style={{ color: 'var(--color-success)', fontWeight: 600 }}>₹{d.receivedAmount.toLocaleString('en-IN')}</td>
                    <td style={{ color: d.deductionAmount > 0 ? 'var(--color-danger)' : 'inherit' }}>
                      {d.deductionAmount > 0 ? `-₹${d.deductionAmount.toLocaleString('en-IN')}` : '₹0'}
                    </td>
                    <td>₹{d.refundDue.toLocaleString('en-IN')}</td>
                    <td>₹{d.refundPaid.toLocaleString('en-IN')}</td>
                    <td>
                      <span className="badge" style={{ textTransform: 'uppercase' }}>
                        {d.settlementStatus.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Payments History */}
      {activeReportTab === 'payments' && (
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="card-title">All Historical Payments</h3>
              <p className="card-subtitle">Complete audit trail of all recorded collections</p>
            </div>
            <button onClick={exportPaymentsCSV} className="btn btn-subtle btn-sm">
              <FileSpreadsheet size={14} />
              <span>Download Excel/CSV</span>
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tenant</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Reference / UTR</th>
                  <th>Billing Month</th>
                </tr>
              </thead>
              <tbody>
                {bills
                  .flatMap((b) => b.payments.map((p) => ({ ...p, month: b.monthYear })))
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.date}</td>
                      <td><strong>{p.tenantName}</strong></td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                        ₹{p.amount.toLocaleString('en-IN')}
                      </td>
                      <td><span className="badge">{p.method}</span></td>
                      <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{p.referenceNo || 'N/A'}</td>
                      <td>{p.month}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
