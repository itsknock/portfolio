import React from 'react';
import { View, Text, Pressable, Platform, Alert } from 'react-native';
import type { Proveedor } from '../app/Types';
import styles from '../app/Styles';
import VendorImage from "../components/vendorImage";

// Confirmation dialog
function showConfirm(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onConfirm },
    ],
    { cancelable: true }
  );
}

type ItemProps = {
  proveedor: Proveedor;
  onDelete: (id: string) => void;
  onEdit: (no: string) => void;
  isHomologado?: boolean;
};

const Field = ({ label, value, valueStyle }: { label: string; value: string; valueStyle?: object }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 2, flexShrink: 1, minWidth: 0 }}>
    <Text style={styles.vendorItemFieldLabel}>{label}: </Text>
    <View style={{ flex: 1, minWidth: 0, flexShrink: 1 }}>
      <Text style={[valueStyle as object || {}, { flexShrink: 1 }]}>
        {value}
      </Text>
    </View>
  </View>
);

export default function ItemVendor({ proveedor, onDelete, onEdit, isHomologado }: ItemProps) {
  return (
    <View
      style={[
        styles.vendorListItem,
        { flexWrap: 'wrap' },
        isHomologado && styles.vendorListItemHomologado,
      ]}
    >

      {/* Image row+ buttons occupy the whole row */}
      <View
        style={{flexDirection: 'row',alignItems: 'center',
          flex: 1,
          width: '100%',           // forces to occupy full width
          alignSelf: 'stretch',    // contrarests alignItems: 'flex-start' from parent
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
        }}
      >
        <VendorImage proveedor={proveedor} style={styles.vendorImage} />

        {/* Item vendor buttons */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}
        >
          <Pressable
            style={[styles.modifyVendorPressable]}
            onPress={() => onEdit(proveedor.no!)}
          >
            <Text style={styles.PressableText}>Modify</Text>
          </Pressable>

          <Pressable
            style={[styles.deleteVendorPressable]}
            onPress={() =>
              showConfirm(
                'Confirm delete',
                `Are you sure about deleting ${proveedor.name}?`,
                () => onDelete(proveedor.no!)
              )
            }
          >
            <Text style={styles.PressableText}>Delete</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.vendorContent, { minWidth: 0, flexShrink: 1}]}>
        <Text style={[styles.vendorTitle, { minWidth: 0, flexShrink: 1 }]}>
          {proveedor.name}
        </Text>

        <Field label="Email" value={proveedor.email || ''} />
        <Field label="Country" value={proveedor.country || ''} />
        <Field
          label="Validation state"
          value={proveedor.estadoHomologacion || ''}
          valueStyle={isHomologado ? styles.textHomologado : undefined}
        />
      </View>
    </View>
  );
}
