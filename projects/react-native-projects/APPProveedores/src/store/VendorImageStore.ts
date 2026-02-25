// store/VendorImageStore.ts - Zustand store for caching and uploading vendor images

import { create } from "zustand";
import { 
  buildVendorPictureUrl, 
  fetchVendorPicture, 
  uploadVendorImage 
} from "../apiCalls/VendorImageRequests";

type VendorImageCacheEntry = {
  imageUrl: string | null;  // cached image URL
  loading: boolean;          // is currently fetching/uploading
  error: string | null;      // error message if fetch/upload failed
};

type VendorImageCache = Record<string, VendorImageCacheEntry>;

type VendorImageStore = {
  cache: VendorImageCache;

  fetchPicture: (vendorGuid: string) => Promise<void>; // fetch and cache image
  getImageUrl: (vendorGuid: string) => string | null;  // get cached URL
  isLoading: (vendorGuid: string) => boolean;          // loading state
  getError: (vendorGuid: string) => string | null;    // last error
  uploadImage: (guid: string, vendorNo: string, file: File | string) => Promise<string | null>; // upload & cache
  clearImage: (vendorGuid: string) => void;           // remove one cache entry
  clearAll: () => void;                               // clear entire cache
};

export const useVendorImageStore = create<VendorImageStore>((set, get) => ({
  cache: {},

  fetchPicture: async (vendorGuid: string) => {
    if (!vendorGuid) return;

    // Mark as loading
    set((state) => ({
      cache: {
        ...state.cache,
        [vendorGuid]: { imageUrl: null, loading: true, error: null }
      }
    }));

    try {
      const pictureUrl = buildVendorPictureUrl(vendorGuid);
      if (!pictureUrl) throw new Error("Invalid picture URL");

      const url = await fetchVendorPicture(pictureUrl);

      set((state) => ({
        cache: {
          ...state.cache,
          [vendorGuid]: { imageUrl: url || null, loading: false, error: null }
        }
      }));
    } catch (err: any) {
      set((state) => ({
        cache: {
          ...state.cache,
          [vendorGuid]: { 
            imageUrl: null, 
            loading: false, 
            error: err.message || "Failed to fetch image"
          }
        }
      }));
    }
  },

  getImageUrl: (vendorGuid: string) => get().cache[vendorGuid]?.imageUrl || null,
  isLoading: (vendorGuid: string) => get().cache[vendorGuid]?.loading || false,
  getError: (vendorGuid: string) => get().cache[vendorGuid]?.error || null,

  uploadImage: async (guid: string, vendorNo: string, file: File | string) => {
    set((state) => ({
      cache: {
        ...state.cache,
        [guid]: { imageUrl: null, loading: true, error: null }
      }
    }));

    try {
      const imageId = await uploadVendorImage(guid, vendorNo, file);
      if (imageId) {
        // Refresh cache after upload
        await get().fetchPicture(guid);
        return imageId;
      }
      return null;
    } catch (err: any) {
      set((state) => ({
        cache: {
          ...state.cache,
          [guid]: { imageUrl: null, loading: false, error: err.message || "Upload failed" }
        }
      }));
      return null;
    }
  },

  clearImage: (vendorGuid: string) => 
    set((state) => {
      const newCache = { ...state.cache };
      delete newCache[vendorGuid];
      return { cache: newCache };
    }),

  clearAll: () => set({ cache: {} }),
}));
