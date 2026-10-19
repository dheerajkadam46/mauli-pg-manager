import React from 'react';
import { Modal } from '../common/Modal';
import { usePG } from '../../context/PGContext';
import {
  BedDouble,
  Receipt,
  ShieldCheck,
  ArrowRightLeft,
  Users,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const QuickTourModal: React.FC = () => {
  const { isQuickTourOpen, setIsQuickTourOpen, setActiveTab } = usePG();

  const tourItems = [
    {
      icon: BedDouble,
      title: 'Interactive Occupancy Map',
      desc: 'Visual floor-by-floor room grid. View who occupies each bed, identify vacant beds, and transfer or assign tenants with one click.',
      tab: 'rooms',
    },
    {
      icon: Receipt,
      title: 'Rent & Bills (Partial Payments)',
      desc: 'Record partial or full rent collections. The system updates outstanding balances immediately and issues clean, print-friendly receipts.',
      tab: 'bills',
    },
    {
      icon: ShieldCheck,
      title: 'Security Deposits & Checkout Deductions',
      desc: 'Transparently tracks ₹3,000 deposits received, subtracts standard ₹1,000 maintenance deduction, and accurately calculates ₹2,000 refund due.',
      tab: 'deposits',
    },
    {
      icon: ArrowRightLeft,
      title: '15-Day Notice & Checkout Wizard',
      desc: 'Enforces your 15-day notice policy, runs a physical room inspection checklist, processes refund, and releases beds.',
      tab: 'lifecycle',
    },
    {
      icon: Users,
      title: 'Tenant Profiles & Directory',
      desc: 'Full occupant records with emergency contacts, monthly rent history, deposit ledger, and activity logs.',
      tab: 'tenants',
    },
  ];

  return (
    <Modal
      isOpen={isQuickTourOpen}
      onClose={() => setIsQuickTourOpen(false)}
      title="Welcome to Mauli PG Manager Demo"
      subtitle="Designed specifically for Indian PG owners to simplify tenant records, rent collection, and deposits."
      maxWidth="620px"
      footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            All numbers and tenants shown are simulated demo data.
          </span>
          <button
            onClick={() => setIsQuickTourOpen(false)}
            className="btn btn-primary btn-sm"
            style={{ minHeight: '38px', flex: '1 1 180px' }}
          >
            Start Exploring Demo
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--color-primary-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-primary-border)',
            color: 'var(--color-primary)',
            fontSize: '13px',
          }}
        >
          <strong>Namaste!</strong> This interactive prototype allows you to test real PG workflows on your phone or computer. Click any feature below to jump directly to it:
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tourItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  setActiveTab(item.tab);
                  setIsQuickTourOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-primary-light)';
                  e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-primary-subtle)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-primary)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
