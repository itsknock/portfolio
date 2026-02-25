// VendorStore.ts - Zustand store for managing vendors and global alerts

import { create } from "zustand";
import type { Proveedor } from "../app/Types";
import { getVendors, deleteVendors, modifyVendors, addVendors } from "../apiCalls/VendorRequests";

// WebGlobalAlert can be 'success', 'danger', or 'info'
type WebGlobalAlert = { type: "success" | "danger" | "info"; message: string } | null;

type VendorStore = {
  proveedores: Proveedor[];
  loading: boolean;
  webGlobalAlert: WebGlobalAlert;

  fetchVendors: () => Promise<void>;
  deleteVendor: (no: string) => Promise<void>;
  saveVendor: (editingNo: string | null, payload: any) => Promise<void>;
  setWebGlobalAlert: (alert: WebGlobalAlert) => void;
};

export const useVendorStore = create<VendorStore>((set, get) => ({
  proveedores: [],
  loading: false,
  webGlobalAlert: null,

  fetchVendors: async () => {
    set({ loading: true, webGlobalAlert: null });
    try {
      const data = await getVendors();
      const array = Array.isArray(data.value) ? data.value : [];
      const mappedData: Proveedor[] = array.map((p: any) => ({
        GUID: p.id,
        contact: p.contact,
        name: p.name || "Nameless",
        email: p.eMail || "",
        country: p.countryRegionCode || "",
        estadoHomologacion: p.estadoHomologacion || "",
        image: p.image || "",
        no: p.no,
      }));
      set({ proveedores: mappedData });
    } catch (err) {
      console.error(err);
      set({
        proveedores: [],
        webGlobalAlert: { type: "danger" as const, message: "Failed to fetch vendors" },
      });
      setTimeout(() => get().setWebGlobalAlert(null), 3000);
    } finally {
      set({ loading: false });
    }
  },

  deleteVendor: async (no: string) => {
    try {
      await deleteVendors(no);
      get().setWebGlobalAlert({ type: "success" as const, message: "Vendor deleted" });
      await get().fetchVendors();
    } catch (err) {
      console.error(err);
      get().setWebGlobalAlert({ type: "danger" as const, message: "Failed to delete vendor" });
      setTimeout(() => get().setWebGlobalAlert(null), 3000);
    }
  },

  saveVendor: async (editingNo: string | null, payload: any) => {
    try {
      const cleanPayload = { ...payload };
      if (cleanPayload.Image === "") delete cleanPayload.Image;

      if (editingNo) {
        await modifyVendors(editingNo, cleanPayload);
        get().setWebGlobalAlert({ type: "success" as const, message: "Vendor updated" });
      } else {
        await addVendors(cleanPayload);
        get().setWebGlobalAlert({ type: "success" as const, message: "Vendor added" });
      }
      await get().fetchVendors();
    } catch (err: any) {
      get().setWebGlobalAlert({ type: "danger" as const, message: err?.message || "Save failed" });
      setTimeout(() => get().setWebGlobalAlert(null), 4000);
    }
  },

  setWebGlobalAlert: (alert: WebGlobalAlert) => set({ webGlobalAlert: alert }),
}));
