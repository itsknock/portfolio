// vendorImage.tsx - Displays vendor image with support for local preview
import React, { useEffect } from "react";
import { View, Image, ActivityIndicator } from "react-native";
import { useVendorImageStore } from "../store/VendorImageStore";
import type { Proveedor } from "../app/Types";
import styles from "../app/Styles";

const PLACEHOLDER =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Dynamics_365_Business_Central_logo.svg/2048px-Dynamics_365_Business_Central_logo.svg.png";

const ZERO_GUID = "00000000-0000-0000-0000-000000000000";

type VendorImageProps = {
  proveedor?: Proveedor | null;      // vendor object
  guid?: string | null;              // optional vendor GUID
  style?: object;                    // optional styling
  localPreviewUrl?: string | null;   // local preview URL (priority over store)
};

export default function VendorImage({ 
  proveedor, 
  guid, 
  style, 
  localPreviewUrl 
}: VendorImageProps) {
  const vendorGuid = guid || proveedor?.GUID;
  const imageUrl = useVendorImageStore((state) => state.getImageUrl(vendorGuid || '')); // fetched image
  const loading = useVendorImageStore((state) => state.isLoading(vendorGuid || ''));   // loading state

  // Fetch picture from store if vendor has image and it's not ZERO_GUID
  useEffect(() => {
    if (vendorGuid && proveedor?.image && proveedor.image !== ZERO_GUID) {
      useVendorImageStore.getState().fetchPicture(vendorGuid);
    }
  }, [vendorGuid, proveedor?.image]);

  // Priority: localPreviewUrl > fetched image > placeholder
  // NO fer GET si localPreviewUrl és ZERO_GUID
  const uri = localPreviewUrl === ZERO_GUID 
    ? PLACEHOLDER  // mostra placeholder sense fer GET
    : localPreviewUrl || 
      (proveedor?.image && proveedor.image !== ZERO_GUID ? imageUrl : PLACEHOLDER) ||
      PLACEHOLDER;

  return (
    <View style={{ position: "relative" }}>
      <Image
        source={{ uri }}
        style={style || styles.vendorImage}
        resizeMode="cover"
      />
      {loading && !localPreviewUrl && ( // show loader only when fetching store image
        <ActivityIndicator
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -15 }, { translateY: -15 }]
          }}
          size="small"
          color="#666"
        />
      )}
    </View>
  );
}
