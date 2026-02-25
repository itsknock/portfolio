// viewlistvendors.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Platform } from 'react-native';
import VendorList from '../components/VendorList';
import VendorFormModal from '../components/VendorFormModal';
import AlertContainer from '../components/alertContainer'; // Global alert UI
import type { Proveedor } from '../app/Types';
import HeaderComponent from '../components/Header';
import VendorFilters from '../components/VendorFilters';
import { addVendors, modifyVendors } from '../apiCalls/VendorRequests';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useVendorStore } from '../store/VendorStore';
import { useVendorFormStore } from '../store/VendorFormStore';

export default function ViewListVendors() {
  // Global vendor state (Zustand)
  const proveedores = useVendorStore((state) => state.proveedores);
  const loading = useVendorStore((state) => state.loading);
  const deleteVendor = useVendorStore((state) => state.deleteVendor);
  const saveVendor = useVendorStore((state) => state.saveVendor);
  const fetchVendors = useVendorStore((state) => state.fetchVendors);

  // Load vendor list once on mount
  useEffect(() => {
    fetchVendors();
  }, []); // empty deps avoids infinite re-renders

  // Modal + form state (Zustand)
  const {
    modalVisible,
    setModalVisible,
    formData,
    setFormData,
    editingNo,
    openModalForAdd,
    openModalForEdit,
  } = useVendorFormStore();

  // Local filter UI state
  const [showOnlyHomologados, setShowOnlyHomologados] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Memoized filtered vendor list to avoid unnecessary recomputation
  const filteredProveedores = useMemo(() => {
    const q = searchText.trim().toLowerCase();

    return proveedores.filter((p) => {
      const matchHomologado = showOnlyHomologados
        ? p.estadoHomologacion === 'Homologado'
        : true;

      const matchSearch =
        q === '' ||
        (p.name || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q);

      return matchHomologado && matchSearch;
    });
  }, [proveedores, showOnlyHomologados, searchText]);

  // Vendor currently being edited (or null)
  const editingProveedor: Proveedor | null =
    editingNo != null ? proveedores.find((v) => v.no === editingNo) ?? null : null;

  return (
    <View style={{ flex: 1 }}>
      {/* App header */}
      <HeaderComponent />

      {/* Filters and add-new button */}
      <VendorFilters
        showOnlyHomologados={showOnlyHomologados}
        setShowOnlyHomologados={setShowOnlyHomologados}
        onAdd={openModalForAdd}
        filteredCount={filteredProveedores.length}
        onSearch={setSearchText}
      />

      {/* Vendor list */}
      <VendorList
        proveedores={filteredProveedores}
        loading={loading}
        onDelete={deleteVendor}
        onEdit={(no) => {
          const vendor = proveedores.find((v) => v.no === no);
          if (vendor) openModalForEdit(vendor);
        }}
      />

      {/* Modal for add/edit */}
      <VendorFormModal
        // Key forces remount when modal visibility changes (optional)
        key={`${editingNo ?? 'new-vendor'}-${modalVisible ? 'open' : 'closed'}`}
        proveedor={editingProveedor}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={async () => {
          try {
            // Avoid sending empty Image property
            const cleanPayload = { ...formData };
            if (cleanPayload.Image === '') delete cleanPayload.Image;

            if (editingNo) {
              await modifyVendors(editingNo, cleanPayload);
            } else {
              await addVendors(cleanPayload);
            }

            // Refresh list after saving
            await fetchVendors();

            // Reset form
            setFormData({
              Name: '',
              EMail: '',
              CountryRegionCode: '',
              EstadoHomologacion: '',
              Image: '',
            });

            return { success: true };
          } catch (err: any) {
            console.error(err);
            return { success: false, error: err.message };
          }
        }}
        formData={formData}
        setFormData={setFormData}
        editingNo={editingNo}
      />

      {/* Global alerts outside the modal */}
      <AlertContainer modalVisible={modalVisible} />
    </View>
  );
}
