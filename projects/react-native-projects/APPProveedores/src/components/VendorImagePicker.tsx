// VendorImagePicker.tsx - Handles picking and uploading vendor images
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Pressable, Platform, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import VendorImage from './vendorImage';
import * as ImagePicker from 'expo-image-picker';
import { useVendorImageStore } from '../store/VendorImageStore';
import { useVendorStore } from '../store/VendorStore';
import type { Proveedor } from '../app/Types';
import Styles from '../app/Styles';

type Props = {
  proveedor: Proveedor;                  
  formData: any;                         
  setFormData: React.Dispatch<React.SetStateAction<any>>; 
};

export interface VendorImagePickerRef {
  handleSaveImage: () => Promise<boolean>; 
}

const VendorImagePicker = forwardRef<VendorImagePickerRef, Props>(
  ({ proveedor, formData, setFormData }, ref) => {
    const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
    const [pendingUploadFile, setPendingUploadFile] = useState<File | string | null>(null);

    const uploading = useVendorImageStore((state) => {
      const guid = proveedor?.GUID || '';
      return guid ? state.isLoading(guid) : false;
    });

    const uploadImage = useVendorImageStore((state) => state.uploadImage);
    const setWebGlobalAlert = useVendorStore((state) => state.setWebGlobalAlert);

    const isGuid = (s?: string | null) => {
      if (!s) return false;
      return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);
    };

    const getProveedorGuid = () => proveedor.GUID || null;
    const getProveedorNo = () => proveedor.no || null;

    // Expose handleSaveImage to parent via ref
    useImperativeHandle(ref, () => ({
      handleSaveImage: async () => {
        const guid = getProveedorGuid();
        const no = getProveedorNo();
        
        if (!pendingUploadFile || !guid || !no || !isGuid(guid)) return false;

        try {
          setWebGlobalAlert({ type: 'info', message: 'Uploading image...' });
          const imageGuid = await uploadImage(guid, no, pendingUploadFile);
          
          if (imageGuid) {
            setFormData({ ...formData, Image: imageGuid });
            setWebGlobalAlert({ type: 'success', message: 'Image uploaded successfully' });
          } else {
            setWebGlobalAlert({ type: 'success', message: 'Image uploaded (processing...)' });
          }
          
          setLocalPreviewUrl(null);
          setPendingUploadFile(null);
          return true;
        } catch (err) {
          console.error(err);
          setWebGlobalAlert({ type: 'danger', message: 'Failed to upload image.' });
          return false;
        }
      }
    }));

    // Open file picker / image library
    const handlePickImage = async () => {
      if (uploading) {
        setWebGlobalAlert({ type: 'info', message: 'Upload in progress. Please wait.' });
        return;
      }

      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e: any) => {
          const file = e.target.files[0];
          if (!file) return;
          
          const localUrl = URL.createObjectURL(file);
          setLocalPreviewUrl(localUrl);
          setPendingUploadFile(file);
          setWebGlobalAlert({ type: 'info', message: 'Image preview ready. Click Save to upload.' });
        };
        input.click();
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need access to your photos to select an image.');
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
          const uri = result.assets[0].uri;
          setLocalPreviewUrl(uri);
          setPendingUploadFile(uri);
          setWebGlobalAlert({ type: 'info', message: 'Image preview ready. Click Save to upload.' });
        }
      }
    };

    // Remove local preview / pending file AND UPDATE formData
    const handleDeleteImage = () => {
      const emptyGuid = "00000000-0000-0000-0000-000000000000";

      setLocalPreviewUrl(emptyGuid);
      setPendingUploadFile(null);

      setFormData({
        ...formData,
        Image: emptyGuid,
      });

      setWebGlobalAlert({ type: 'success', message: 'Image preview removed.' });
    };

    return (
      <View style={Styles.containerModalImagePressables}>
        <VendorImage 
          proveedor={proveedor}
          localPreviewUrl={localPreviewUrl} 
          style={Styles.vendorImageModal} 
        />

        <View style={Styles.imageButtonsContainer}>
          {/* Edit button */}
          <Pressable onPress={handlePickImage} style={{ marginRight: 10 }} disabled={uploading}>
            <Icon name="edit" size={35} />
          </Pressable>
          {/* Delete button */}
          <Pressable onPress={handleDeleteImage} disabled={uploading}>
            <Icon name="delete" size={35} />
          </Pressable>
        </View>
      </View>
    );
  }
);

VendorImagePicker.displayName = 'VendorImagePicker';
export default VendorImagePicker;
