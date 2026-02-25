// VendorFormStore.ts - Zustand store for vendor modal state and form data

import { create } from "zustand";
import type { Proveedor } from "../app/Types";

type WebModalAlert = { type: "success" | "danger"; message: string } | null;

type VendorFormData = {
  Name: string;
  Contact: string;
  EMail: string;
  CountryRegionCode: string;
  EstadoHomologacion: string;
  Image: string;
};

type VendorFormStore = {
  modalVisible: boolean;             // modal open/close state
  formData: VendorFormData;          // form data in modal
  editingNo: string | null;          // vendor no if editing
  webModalAlert: WebModalAlert;      // alert in modal

  setModalVisible: (visible: boolean) => void;
  setFormData: (data: Partial<VendorFormData>) => void;
  setWebModalAlert: (alert: WebModalAlert) => void;

  openModalForAdd: () => void;       // open modal for new vendor
  openModalForEdit: (vendor: Proveedor) => void; // open modal to edit vendor
};

const emptyForm: VendorFormData = {
  Name: "",
  Contact: "",
  EMail: "",
  CountryRegionCode: "",
  EstadoHomologacion: "",
  Image: "",
};

export const useVendorFormStore = create<VendorFormStore>((set) => ({
  modalVisible: false,
  formData: emptyForm,
  editingNo: null,
  webModalAlert: null,

  setModalVisible: (visible) => set({ modalVisible: visible }),

  setFormData: (data) =>
    set((state) => ({ formData: { ...state.formData, ...data } })),

  setWebModalAlert: (alert) => set({ webModalAlert: alert }),

  openModalForAdd: () =>
    set({
      editingNo: null,
      formData: emptyForm,
      webModalAlert: null,
      modalVisible: true,
    }),

  openModalForEdit: (vendor: Proveedor) =>
    set({
      editingNo: vendor.no || null,
      formData: {
        Name: vendor.name || "",
        Contact: vendor.contact || "",
        EMail: vendor.email || "",
        CountryRegionCode: vendor.country || "",
        EstadoHomologacion: vendor.estadoHomologacion || "",
        Image: "",
      },
      webModalAlert: null,
      modalVisible: true,
    }),
}));
