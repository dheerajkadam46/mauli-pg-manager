import React from 'react';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'danger':
      case 'warning':
        return <AlertTriangle size={24} color={type === 'danger' ? 'var(--color-danger)' : 'var(--color-accent)'} />;
      default:
        return <Info size={24} color="var(--color-info)" />;
    }
  };

  const getConfirmBtnClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-accent';
      case 'warning':
        return 'btn btn-primary';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
      footer={
        <>
          <button onClick={onClose} className="btn btn-outline btn-sm">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`${getConfirmBtnClass()} btn-sm`}>
            {confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
        <p style={{ fontSize: '13.5px', color: 'var(--color-text-main)', lineHeight: 1.5 }}>{message}</p>
      </div>
    </Modal>
  );
};
