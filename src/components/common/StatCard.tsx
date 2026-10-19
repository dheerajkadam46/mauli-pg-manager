import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  iconBgColor = 'var(--color-primary-subtle)',
  iconColor = 'var(--color-primary)',
  onClick,
  accent = false,
}) => {
  return (
    <div
      className="stat-card"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        borderLeft: accent ? '4px solid var(--color-accent)' : undefined,
      }}
    >
      <div className="stat-header">
        <span className="stat-label">{label}</span>
        <div className="stat-icon-wrapper" style={{ backgroundColor: iconBgColor, color: iconColor }}>
          <Icon size={18} />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      {subtext && <div className="stat-footer">{subtext}</div>}
    </div>
  );
};
