// VendorImageUploader.tsx - Simple image picker/upload component for vendor
import React, { useState } from "react";
import { View, Image, Pressable, Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useVendorImageStore } from "../store/VendorImageStore";

type VendorImageUploaderProps = {
  vendorGuid?: string | null;
  vendorNo?: string | null;
  imageUrl?: string | null;
  onImageSelected: (uri: string | null) => void;
  style?: object;
};

export default function VendorImageUploader({
  vendorGuid,
  vendorNo,
  imageUrl,
  onImageSelected,
  style,
}: VendorImageUploaderProps) {
  const [uri, setUri] = useState<string | null>(imageUrl || null);

  const pickImage = async () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
          const localUrl = URL.createObjectURL(file);
          setUri(localUrl);
          onImageSelected(localUrl);
        }
      };
      input.click();
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your photos to select an image.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const localUri = result.assets[0].uri;
        setUri(localUri);
        onImageSelected(localUri);
      }
    }
  };

  const removeImage = async () => {
    setUri(null); // remove locally
    try {
      if (vendorGuid && vendorNo) {
        // delete from server via store
        await useVendorImageStore.getState().uploadImage(vendorGuid, vendorNo, null);
      }
    } catch (err) {
      console.error("Failed to delete image from server", err);
    }
    onImageSelected(null); // notify parent
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {uri && (
        <Image
          source={{ uri }}
          style={[{ width: 100, height: 100, borderRadius: 8 }, style]}
        />
      )}
      <View style={{ marginLeft: 10 }}>
        <Pressable onPress={pickImage} style={{ marginBottom: 10 }}>
          <Icon name="edit" size={30} />
        </Pressable>
        <Pressable onPress={removeImage}>
          <Icon name="delete" size={30} />
        </Pressable>
      </View>
    </View>
  );
}
