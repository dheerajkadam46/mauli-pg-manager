import React from 'react';
import { Modal } from '../common/Modal';
import { usePG } from '../../context/PGContext';
import { Printer, Download, CheckCircle2 } from 'lucide-react';

export const ReceiptModal: React.FC = () => {
  const { selectedReceiptBill, setSelectedReceiptBill, settings } = usePG();

  if (!selectedReceiptBill) return null;

  const bill = selectedReceiptBill;
  const latestPayment = bill.payments[bill.payments.length - 1];

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={!!selectedReceiptBill}
      onClose={() => setSelectedReceiptBill(null)}
      title="Rent Receipt Preview"
      subtitle={`Official payment receipt for ${bill.tenantName}`}
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
          <button
            onClick={() => setSelectedReceiptBill(null)}
            className="btn btn-outline btn-sm"
            style={{ minHeight: '38px', flex: '1 1 100px' }}
          >
            Close
          </button>
          <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ minHeight: '38px', flex: '2 1 160px' }}>
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </div>
      }
    >
      {/* Printable Receipt Card */}
      <div
        className="print-area"
        style={{
          border: '2px solid var(--color-primary-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontFamily: 'var(--font-body)',
        }}
      >
        {/* Receipt Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '12px',
            borderBottom: '2px solid var(--color-primary)',
            paddingBottom: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 700, color: 'var(--color-primary)', margin: 0 }}>
              {settings.name}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              {settings.subtitle}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px', maxWidth: '320px' }}>
              {settings.address}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-primary)', marginTop: '2px', fontWeight: 500 }}>
              Contact: {settings.contactPhone}
            </div>
          </div>

          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: 'var(--color-primary-subtle)',
                color: 'var(--color-primary)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Rent Receipt
            </div>
            <div style={{ fontSize: '12px', marginTop: '6px', fontWeight: 600 }}>
              Receipt No: #{bill.id.replace('bill-', 'REC-')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Date: {latestPayment ? latestPayment.date : new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>

        {/* Tenant Information Bar */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '12px',
            marginBottom: '16px',
            fontSize: '13px',
          }}
        >
          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              Received From (Tenant)
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--color-primary)' }}>
              {bill.tenantName}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              Room / Bed Assigned
            </div>
            <div style={{ fontWeight: 600 }}>
              Room {bill.roomNumber} ({bill.bedId})
            </div>
          </div>

          <div>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              Billing Month
            </div>
            <div style={{ fontWeight: 600 }}>{bill.monthYear}</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
              Payment Status
            </div>
            <div
              style={{
                fontWeight: 700,
                color: bill.status === 'paid' ? 'var(--color-success)' : 'var(--color-warning)',
              }}
            >
              {bill.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table style={{ width: '100%', marginBottom: '16px', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 0', color: 'var(--color-text-muted)' }}>Particulars</th>
              <th style={{ textAlign: 'right', padding: '8px 0', color: 'var(--color-text-muted)' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                Monthly Accommodation & Food Charges ({bill.monthYear})
              </td>
              <td style={{ textAlign: 'right', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)', fontWeight: 600 }}>
                ₹{bill.billAmount.toLocaleString('en-IN')}.00
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px 0', color: 'var(--color-success)' }}>
                Total Amount Received
              </td>
              <td style={{ textAlign: 'right', padding: '8px 0', color: 'var(--color-success)', fontWeight: 700 }}>
                ₹{bill.amountPaid.toLocaleString('en-IN')}.00
              </td>
            </tr>
            <tr style={{ borderTop: '2px solid var(--color-border)' }}>
              <td style={{ padding: '10px 0', fontWeight: 700, fontSize: '14px' }}>
                Remaining Balance Due
              </td>
              <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: 700, fontSize: '14px', color: bill.outstandingAmount > 0 ? 'var(--color-accent)' : 'inherit' }}>
                ₹{bill.outstandingAmount.toLocaleString('en-IN')}.00
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Transaction Details */}
        {latestPayment && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: '#f9fafb',
              border: '1px dashed var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12px',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: '4px' }}>Latest Transaction Details:</div>
            <div>Payment Mode: <strong>{latestPayment.method}</strong></div>
            {latestPayment.referenceNo && <div>Ref/UTR No: <strong>{latestPayment.referenceNo}</strong></div>}
            <div>Payment Date: {latestPayment.date}</div>
          </div>
        )}

        {/* Footer & Signature */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '24px',
            borderTop: '1px solid var(--color-border-light)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', maxWidth: '300px' }}>
            * This is a computer-generated receipt from Mauli PG Manager demo prototype. Subject to realization of funds.
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '36px' }}>
              For Mauli PG
            </div>
            <div style={{ borderTop: '1px solid #9ca3af', width: '160px', paddingTop: '4px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
              Authorized Signatory
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
