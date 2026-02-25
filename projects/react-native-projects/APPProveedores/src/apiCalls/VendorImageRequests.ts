//VendorImageRequests.ts

// --- Basic config ---
export const COMPANY_ID = "a29f18fa-aaa7-f011-a7af-6045bdacd9b0";
export const API_BASE_PUBLISHER = `http://bc2-default:7048/BC/api/publisherName/apiGroup/v1.0/companies(${COMPANY_ID})/`;
export const API_BASE_V2 = `http://bc2-default:7048/BC/api/v2.0/companies(${COMPANY_ID})/`;
export const USERNAME = "bertaalvarez";
export const PASSWORD = "EeN2LFHWZQ/L6TfRxHZj58D/NHEqMR5iO66vZbX7PHE=";

// Generates basic authentication header from url and user+password.
export function basicAuthHeader() {
  return "Basic " + btoa(`${USERNAME}:${PASSWORD}`);
}

// --- Getting vendors list ---
export async function getVendorGUID() {
  try {
    const url = `${API_BASE_PUBLISHER}vendors`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET Error ${res.status}: ${res.statusText} - ${text}`);
    }

    const data = await res.json();
    const items = Array.isArray(data?.value) ? data.value : [];
    return items;
  } catch (error) {
    console.error("Error obtaining vendors GUID:", error);
    return [];
  }
}

export function extractVendorGuids(vendors: any[]) {
  return vendors.map(v => v.id).filter(Boolean) as string[];
}

export function buildVendorPictureUrl(guid: string) {
  if (!guid) return null;
  return `${API_BASE_V2}vendors(${guid})/picture/pictureContent`;
}

export async function fetchVendorPicture(url: string) {
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: basicAuthHeader(),
        Accept: "image/*",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET picture Error ${res.status}: ${res.statusText} - ${text}`);
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error fetching vendor picture:", error);
    return null;
  }
}

// --- GET VendorHomologacions(no) to obtain image id ---
// Returns the image id GUID (string) or null
export async function getVendorHomologaciones(vendorNo: string) {
  if (!vendorNo) return null;
  try {
    const url = `${API_BASE_PUBLISHER}VendorHomologacions('${encodeURIComponent(vendorNo)}')`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET VendorHomologacions Error ${res.status}: ${res.statusText} - ${text}`);
    }

    const json = await res.json();
    // Ajusta segons l'estructura retornada per la teva API:
    // S'intenta recuperar camp ImageId / imageId o similar; si la resposta és l'entitat sencera,
    // explora json i retorna el camp correcte.
    const imageId =
      json?.ImageId ||
      json?.imageId ||
      json?.Image?.id ||
      (json?.value && json.value[0] && (json.value[0].ImageId || json.value[0].imageId)) ||
      null;

    return imageId || null;
  } catch (error) {
    console.error("Error fetching VendorHomologacions:", error);
    return null;
  }
}

/**
 * Uploads a vendor image to Business Central then fetches the image id via VendorHomologacions.
 * @param guid Vendor GUID (systemId)
 * @param vendorNo Vendor No (e.g. 'V00480')
 * @param file File object (web) or local URI (mobile/Expo)
 * @returns the imageId assigned by BC (string) or null on failure
 */
export async function uploadVendorImage(guid: string, vendorNo: string, file: File | string) {
  if (!guid || !vendorNo || !file) return null;

  try {
    let body: Blob;
    let contentType: string;

    if (typeof file === 'string') {
      // Web-only scenario: file should NEVER be a string (URI) here.
      // If it is, do NOT upload, just treat it as local preview.
      console.warn('uploadVendorImage called with string in web mode; skipping upload.');
      return null;
    } else {
      // Web: file is a File/Blob object from <input type="file">
      if (file.size === 0) throw new Error('File is empty');
      body = file;
      contentType = file.type || 'image/jpeg';
    }

    const url = `${API_BASE_V2}vendors(${guid})/picture/pictureContent`;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: basicAuthHeader(),
        'Content-Type': contentType,
        'If-Match': '*',
      },
      body, // send File/Blob directly
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Upload Error ${res.status}: ${res.statusText} - ${text}`);
    }

    // Optional: if your API uses VendorHomologacions to store Image GUID
    const imageId = await getVendorHomologaciones(vendorNo);
    return imageId ?? null;
  } catch (err) {
    console.error('Error uploading vendor image (web):', err);
    return null;
  }
}
