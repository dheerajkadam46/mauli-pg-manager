import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { usePG } from '../../context/PGContext';

export const DemoBanner: React.FC = () => {
  const { setIsQuickTourOpen, setIsFeedbackOpen } = usePG();

  return (
    <div className="demo-banner">
      <div className="demo-banner-content">
        <span className="demo-badge-pill">DEMO MODE</span>
        <span>
          <strong>Mauli PG Manager</strong> — Interactive Client Prototype. Simulated records for testing.
        </span>
      </div>

      <div className="demo-banner-actions">
        <button
          onClick={() => setIsQuickTourOpen(true)}
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
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
            padding: '4px 10px',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            whiteSpace: 'nowrap',
          }}
        >
          <Sparkles size={13} />
          <span>Feedback</span>
        </button>
      </div>
    </div>
  );
};
