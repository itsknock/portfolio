//vendorService.ts
import type { Proveedor } from '../app/Types';
import {
  getVendors as apiGet,
  deleteVendors as apiDelete,
  modifyVendors as apiModify,
  addVendors as apiAdd
} from '../apiCalls/VendorRequests';

/**
 * Fetch vendors from API and map to Proveedor[]
 * Uses `no` as the unique key
 */
export const fetchVendors = async (): Promise<Proveedor[]> => {
  const data = await apiGet();
  const array = Array.isArray(data.value) ? data.value : [];
  return array.map((p: any, index: number) => ({
    no: p.no?.toString() || `prov-${index}`, // <-- use no
    name: p.name || 'Nameless',
    email: p.eMail || '',
    country: p.countryRegionCode || '',
    estadoHomologacion: p.estadoHomologacion || '',
    GUID: p.id, // keep GUID only for images
  }));
};

/**
 * Delete a vendor by its `no`
 */
export const deleteVendor = (no: string) => apiDelete(no);

/**
 * Add or modify a vendor
 * If `no` is provided, calls modify, else add
 */
export const saveVendor = (no: string | null, payload: any) =>
  no ? apiModify(no, payload) : apiAdd(payload);
