//Dropdown.tsx
import React from "react";
import { View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import styles from '../app/Styles';
import type { Dropdown as Option } from '../app/Types';
import regionCodes from '../../assets/RegionCodes.json';

interface DropdownProps {
  value: string;                // currently selected value
  onChange: (value: string) => void; // callback when selection changes
}

// Dropdown for homologation status
export function DropdownHomologado({ value, onChange }: DropdownProps) {
  const optionsHomologado: Option[] = [
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'En revisión', value: 'En revisión' },
    { label: 'Homologado', value: 'Homologado' },
  ];

  return (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(String(itemValue))}
        style={styles.picker}
      >
        {optionsHomologado.map((opt, idx) => (
          <Picker.Item key={opt.value ?? idx} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
}

// Dropdown for countries loaded from JSON
export function DropdownCountries({ value, onChange }: DropdownProps) {
  // Map JSON entries to {label, value}, ignore entries without a code
  const optionsCountries: Option[] = Array.isArray(regionCodes)
    ? regionCodes
        .map((item: any) => ({
          label: item?.["Nombre"] ?? String(item?.["Código"] ?? ""),
          value: String(item?.["Código"] ?? ""),
        }))
        .filter(opt => opt.value !== "")
    : [];

  return (
    <View style={styles.pickerWrapper}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(String(itemValue))}
        style={styles.picker}
      >
        {optionsCountries.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
}
