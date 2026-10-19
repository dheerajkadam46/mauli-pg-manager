import React from 'react';
import { Sparkles, Info, HelpCircle } from 'lucide-react';
import { usePG } from '../../context/PGContext';

export const DemoBanner: React.FC = () => {
  const { setIsQuickTourOpen, setIsFeedbackOpen } = usePG();

  return (
    <div className="demo-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span className="demo-badge-pill">DEMO PROTOTYPE</span>
        <span>
          <strong>Mauli PG Manager</strong> — Interactive Client Review. All records are fictional simulations for demonstration.
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={() => setIsQuickTourOpen(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '3px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <HelpCircle size={13} />
          <span>Quick Tour</span>
        </button>

        <button
          onClick={() => setIsFeedbackOpen(true)}
          style={{
            background: 'var(--color-accent)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '3px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Sparkles size={13} />
          <span>Request Changes</span>
        </button>
      </div>
    </div>
  );
};
