// VendorRequest.ts

// Company's GUID used to build the API URL.
// Should be handled with environment variables in real deployments.
export const COMPANY_ID = "a29f18fa-aaa7-f011-a7af-6045bdacd9b0";

// Base URL for VendorHomologacions OData endpoint.
export const APIHOMOLOGACIONS_URL = `http://bc2-default:7048/BC/api/publisherName/apiGroup/v1.0/companies(${COMPANY_ID})/VendorHomologacions`;

// Credentials should not be hardcoded in client code; kept here only for testing.
export const USERNAME = "bertaalvarez";
export const PASSWORD = "EeN2LFHWZQ/L6TfRxHZj58D/NHEqMR5iO66vZbX7PHE=";

// Creates a Basic Auth header using Base64 encoding.
function basicAuthHeader() {
  return "Basic " + btoa(`${USERNAME}:${PASSWORD}`); // btoa is browser-only
}

// ---------------- GET REQUEST ----------------
// Retrieves vendor list via OData. Returns parsed JSON or [] on failure.
export async function getVendors() {
  try {
    const res = await fetch(APIHOMOLOGACIONS_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
      },
    });

    if (!res.ok) {
      const text = await res.text(); // capture server message
      throw new Error(`GET Error ${res.status}: ${res.statusText} - ${text}`);
    }

    return await res.json(); // expected JSON payload
  } catch (error) {
    console.error("Error obtaining vendors:", error);
    return []; // ensures UI doesn't crash
  }
}

// ---------------- DELETE REQUEST ----------------
// Deletes a vendor by its OData key. Handles numeric vs string keys.
// Returns debug info including status and body.
export async function deleteVendors(
  id: string
): Promise<{ ok: boolean; status: number; body?: string }> {
  try {
    const isNumeric = /^\d+$/.test(id); // check OData type requirements
    const escapeForOData = (s: string) => s.replace(/'/g, "''"); // escape quotes

    const keyPart = isNumeric ? id : `'${escapeForOData(id)}'`;
    const url = `${APIHOMOLOGACIONS_URL}(${keyPart})`;

    console.log("DELETE URL:", url);

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
        "If-Match": "*", // bypasses ETag requirements
      },
    });

    const bodyText = await res.text(); // may be empty

    if (!res.ok) {
      console.error(`DELETE Error ${res.status}: ${res.statusText} - ${bodyText}`);
      return { ok: false, status: res.status, body: bodyText };
    }

    return { ok: true, status: res.status, body: bodyText };
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return { ok: false, status: 0, body: String(error) }; // status 0 = network/exception
  }
}

// ---------------- PUT REQUEST (modify) ----------------
// Updates a vendor entry. Assumes OData key is string-based.
// Returns status and body for debugging.
export async function modifyVendors(
  id: string,
  payload: Record<string, any>
): Promise<{ ok: boolean; status: number; body?: string; tried?: string[] }> {
  const escapeForOData = (s: string) => s.replace(/'/g, "''");
  const keyPart = `'${escapeForOData(id)}'`; // simple string key
  const url = `${APIHOMOLOGACIONS_URL}(${keyPart})`;

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
        "If-Match": "*", // overwrite regardless of ETag
      },
      body: JSON.stringify(payload), // send JSON body
    });

    const bodyText = await res.text();

    if (res.ok) {
      console.log(`[modifyVendors] PUT REQUEST SUCCESS: ${url}`);
      return { ok: true, status: res.status, body: bodyText, tried: [url] };
    } else {
      console.error(`[modifyVendors] FAILED ${res.status} for ${url} - ${bodyText}`);
      return { ok: false, status: res.status, body: bodyText, tried: [url] };
    }
  } catch (err: any) {
    console.error(`[modifyVendors] EXCEPTION for ${url}:`, err);
    return { ok: false, status: 0, body: String(err), tried: [url] };
  }
}

// ---------------- POST REQUEST (add) ----------------
// Creates a new vendor entry. Returns debug info including server body.
export async function addVendors(
  payload: Record<string, any>
): Promise<{ ok: boolean; status: number; body?: string }> {
  try {
    const res = await fetch(`${APIHOMOLOGACIONS_URL}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: basicAuthHeader(),
        "OData-Version": "4.0",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();

    if (!res.ok) {
      console.error(`POST Error ${res.status}: ${res.statusText} - ${bodyText}`);
    } else {
      console.log("POST success:", bodyText);
    }

    return { ok: res.ok, status: res.status, body: bodyText };
  } catch (err: any) {
    console.error("Error adding vendor:", err);
    return { ok: false, status: 0, body: String(err) }; // network issue
  }
}
