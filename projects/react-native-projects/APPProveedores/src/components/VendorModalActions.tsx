// VendorModalActions.tsx - Save / Cancel buttons for vendor modal

import React from 'react';
import { View, Pressable, Text } from 'react-native';
import styles from '../app/Styles';

type Props = {
  onSave: () => Promise<void> | void; // callback for saving vendor
  onClose: () => void;                // callback for closing modal
  uploading: boolean;                 // disables buttons during upload
  editingNo?: string | null;          // indicates edit mode
};

export default function VendorModalActions({ onSave, onClose, uploading, editingNo }: Props) {
  return (
    <View>
      {/* Save/Add button */}
      <Pressable 
        style={styles.addVendorPressable} 
        onPress={() => void onSave()} 
        disabled={uploading}
      >
        <Text style={styles.PressableText}>{editingNo ? 'Save' : 'Add'}</Text>
      </Pressable>

      {/* Cancel button */}
      <Pressable 
        style={styles.cancelModifyVendorPressable} 
        onPress={onClose} 
        disabled={uploading}
      >
        <Text style={styles.PressableText}>Cancel</Text>
      </Pressable>
    </View>
  );
}
