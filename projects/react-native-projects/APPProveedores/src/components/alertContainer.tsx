// AlertContainer.tsx - Shows global alerts on page when modal is closed
import React from 'react';
import { Platform, View } from 'react-native';
import { useVendorStore } from '../store/VendorStore';
import BootstrapAlert from './BootstrapAlert';

type AlertContainerProps = {
  modalVisible?: boolean; // Prevent showing alerts when modal is open
};

export default function AlertContainer({ modalVisible = false }: AlertContainerProps) {
  const webGlobalAlert = useVendorStore((state) => state.webGlobalAlert); // global alert state

  // Only render on web and if alert exists and modal is closed
  if (Platform.OS !== 'web' || !webGlobalAlert || modalVisible) return null;

  return (
    <div
      style={{
        position: 'fixed' as const, // keep alert on top-right
        top: '20px',
        right: '20px',
        zIndex: 99999,
        maxWidth: '500px',
      }}
    >
      <BootstrapAlert
        type={webGlobalAlert.type} // e.g., success, error
        message={webGlobalAlert.message}
        onClose={() => useVendorStore.getState().setWebGlobalAlert(null)} // clear alert on close
      />
    </div>
  );
}
