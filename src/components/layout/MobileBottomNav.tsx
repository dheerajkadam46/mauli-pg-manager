import React from 'react';
import { LayoutDashboard, Users, BedDouble, Receipt, Menu } from 'lucide-react';
import { usePG } from '../../context/PGContext';

interface MobileBottomNavProps {
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenMenu }) => {
  const { activeTab, setActiveTab } = usePG();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'bills', label: 'Bills', icon: Receipt },
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}

      <button
        onClick={onOpenMenu}
        className="mobile-bottom-nav-item"
        aria-label="More navigation options"
      >
        <Menu size={20} />
        <span>Menu</span>
      </button>
    </nav>
  );
};
