// BootstrapAlert.tsx - FIXED with proper Bootstrap classes
import React, { useEffect } from 'react';

interface Props {
  type: 'success' | 'danger' | 'warning' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function BootstrapAlert({
  type,
  message,
  onClose,
  duration = 3000
}: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const alertClass = `alert alert-${type} alert-dismissible fade show shadow-sm border-0`;
  
  return (
    <div className={alertClass} role="alert" style={{ marginBottom: '10px' }}>
      <div>{message}</div>
      <button 
        type="button" 
        className="btn-close btn-close-white" 
        onClick={onClose}
        aria-label="Close"
      />
    </div>
  );
}
