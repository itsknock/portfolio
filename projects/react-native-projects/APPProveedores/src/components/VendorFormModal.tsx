//Tinc els seguents fitxers. necessito que si a picker s'acciona handleDeleteimage,
//a part de que faci setLocalPreviewUrl("00000000-0000-0000-0000-000000000000"); que és correcte,
//hauria de passar com a valor a la put request (image: "00000000-0000-0000-0000-000000000000")



// VendorFormModal.tsx - COMPLETE FILE (FULL WIDTH FIXED)
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Modal, Platform, ScrollView } from 'react-native';
import styles from '../app/Styles';
import type { Proveedor } from '../app/Types';
import VendorImagePicker from '../components/VendorImagePicker';
import VendorFormFields from '../components/VendorFormFields';
import VendorModalActions from './VendorModalActions';
import BootstrapAlert from './BootstrapAlert';
import { useVendorStore } from '../store/VendorStore';

type VendorFormData = {
  Name: string;
  EMail: string;
  CountryRegionCode: string;
  EstadoHomologacion: string;
  Image?: string | null;
};


type VendorFormModalProps = {
  proveedor?: Proveedor | null;
  visible: boolean;
  onClose: () => void;
  onSave: () => Promise<{ success: boolean; error?: string }>;
  formData: VendorFormData;
  setFormData: (data: Partial<VendorFormData>) => void;
  editingNo?: string | null;
};

export default function VendorFormModal({
  proveedor,
  visible,
  onClose,
  onSave,
  formData,
  setFormData,
  editingNo,
}: VendorFormModalProps) {
  const imagePickerRef = useRef<{ handleSaveImage: () => Promise<boolean> }>(null);
  const [isSaving, setIsSaving] = useState(false);
  const setWebGlobalAlert = useVendorStore((state) => state.setWebGlobalAlert);
  const webGlobalAlert = useVendorStore((state) => state.webGlobalAlert);

  // Merge form image with existing vendor image if editing
  const proveedorForImage = proveedor
    ? { ...proveedor, imageUrl: formData.Image || proveedor.imageUrl }
    : null;

  // Reset saving state when modal closes
  useEffect(() => {
    if (!visible) setIsSaving(false);
  }, [visible]);

  const handleModalSave = async () => {
    // Validate required fields
    const missingFields = [];
    if (!formData.Name?.trim()) missingFields.push('Name');
    if (!formData.EMail?.trim()) missingFields.push('Email');

    if (missingFields.length > 0) {
      setWebGlobalAlert({
        type: 'danger',
        message: `Please fill in required fields: ${missingFields.join(', ')}`,
      });
      return;
    }

    // Validate basic email format
    if (!formData.EMail.includes('@')) {
      setWebGlobalAlert({
        type: 'danger',
        message: 'Please enter a valid email address (must contain @)',
      });
      return;
    }

    setIsSaving(true);

    try {
      // Upload image if editing and imagePicker exists
      if (editingNo && imagePickerRef.current?.handleSaveImage) {
        const imageUploaded = await imagePickerRef.current.handleSaveImage();
        if (imageUploaded) await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Save vendor using parent handler
      const result = await onSave();

      if (result.success) {
        setWebGlobalAlert({
          type: 'success',
          message: editingNo ? 'Vendor updated successfully' : 'Vendor added successfully',
        });
        setIsSaving(false);
        // Close modal after short delay to show alert
        setTimeout(() => onClose(), 500);
      } else {
        setWebGlobalAlert({ type: 'danger', message: result.error || 'Save failed' });
        setIsSaving(false);
      }
    } catch (error: any) {
      setWebGlobalAlert({ type: 'danger', message: error?.message || 'Save failed' });
      setIsSaving(false);
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Web alert displayed on top of modal */}
        {Platform.OS === 'web' && webGlobalAlert && (
          <div
            style={{
              position: 'absolute' as const,
              top: '20px',
              right: '20px',
              zIndex: 99999,
              maxWidth: '600px',
            }}
          >
            <BootstrapAlert
              type={webGlobalAlert.type}
              message={webGlobalAlert.message}
              onClose={() => useVendorStore.getState().setWebGlobalAlert(null)}
            />
          </div>
        )}

        <ScrollView
          contentContainerStyle={{
            paddingTop: 40,        // fixed top margin
            paddingBottom: 40,     // fixed bottom margin
            paddingHorizontal: 20, // lateral margins (already responsive with width: '90%')
            alignItems: 'center',
            minHeight: '100%',     // ocuppies at least all available height
          }}
          style={{ flex: 1, width: '100%' }}
        >
          <View style={[styles.modalContent, { height: 'auto', minHeight: 500, width: '90%', maxWidth: 900 }]}>
            <Text style={styles.modalTitle}>{editingNo ? 'Modify vendor' : 'Add vendor'}</Text>

            {/* Image picker component */}
            <VendorImagePicker
              ref={imagePickerRef}
              proveedor={proveedorForImage}
              formData={formData}
              setFormData={setFormData}
            />

            {/* Form input fields */}
            <VendorFormFields formData={formData} setFormData={setFormData} />

            {/* Action buttons (Save/Close) */}
            <VendorModalActions
              onSave={handleModalSave}
              onClose={onClose}
              uploading={isSaving}
              editingNo={editingNo}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
