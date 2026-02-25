// types.ts
export type Proveedor = {
  email: string;                   // mandatory, key for unification
  no?: string; 
  contact?: string;                    // optional, may be absent if only picture exists
  name?: string;                   // optional, from homologation API
  country?: string;                // optional, if available
  estadoHomologacion?: string;     // optional, from homologation API
  image?: string;                  // optional, original image ID from BC
  imageUrl?: string;               // optional, actual URL or objectURL to show
  GUID?: string;                   // optional, from picture API
  confidence?: number;             // optional, from unified hook
  sources?: {                      // optional, indicates which APIs contributed
    homologacion?: boolean;
    picture?: boolean;
  };
};

export type Dropdown = {
  label: string;
  value: string;
};

