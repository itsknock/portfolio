// Business Central API configuration
export const COMPANY_ID = "a29f18fa-aaa7-f011-a7af-6045bdacd9b0";

// API endpoints
export const BASE_API_URL = `http://bc2-default:7048/BC/api/publisherName/apiGroup/v1.0/companies(${COMPANY_ID})/`;
export const V2_API_URL = `http://bc2-default:7048/BC/api/v2.0/companies(${COMPANY_ID})/`;
export const APIHOMOLOGACIONS_URL = `${BASE_API_URL}VendorHomologacions`;

// Authentication
export const USERNAME = process.env.BC_USER || "bertaalvarez";
export const PASSWORD = process.env.BC_PASS || "EeN2LFHWZQ/L6TfRxHZj58D/NHEqMR5iO66vZbX7PHE=";

// Generates Basic Auth header
export function basicAuthHeader() {
  return "Basic " + btoa(`${USERNAME}:${PASSWORD}`);
}
