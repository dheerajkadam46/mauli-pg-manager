import React from 'react';
import type { BedStatus, BillStatus, TenancyStatus } from '../../types';

interface BadgeProps {
  type: 'bed' | 'bill' | 'tenancy';
  status: BedStatus | BillStatus | TenancyStatus | string;
}

export const Badge: React.FC<BadgeProps> = ({ type, status }) => {
  if (type === 'bed') {
    switch (status) {
      case 'occupied':
        return <span className="badge badge-occupied">Occupied</span>;
      case 'available':
        return <span className="badge badge-available">Available</span>;
      case 'reserved':
        return <span className="badge badge-reserved">Reserved</span>;
      case 'notice':
        return <span className="badge badge-notice">Notice</span>;
      case 'maintenance':
        return <span className="badge badge-maintenance">Maintenance</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  }

  if (type === 'bill') {
    switch (status) {
      case 'paid':
        return <span className="badge badge-paid">Paid</span>;
      case 'partially_paid':
        return <span className="badge badge-partially-paid">Partially Paid</span>;
      case 'overdue':
        return <span className="badge badge-overdue">Overdue</span>;
      case 'unpaid':
        return <span className="badge badge-unpaid">Unpaid</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  }

  if (type === 'tenancy') {
    switch (status) {
      case 'active':
        return <span className="badge badge-occupied">Active Tenant</span>;
      case 'notice':
        return <span className="badge badge-notice">Notice Given</span>;
      case 'upcoming_checkout':
        return <span className="badge badge-reserved">Ready for Checkout</span>;
      case 'awaiting_settlement':
        return <span className="badge badge-partially-paid">Awaiting Settlement</span>;
      case 'checked_out':
        return <span className="badge badge-maintenance">Checked Out</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  }

  return <span className="badge">{status}</span>;
};
