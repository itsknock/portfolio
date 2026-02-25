// VendorFilters.tsx
// Component for showing filters, search bar and add new vendor button

import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import styles from '../app/Styles';

interface Props {
  showOnlyHomologados: boolean;                     // if only show validated
  setShowOnlyHomologados: (val: boolean) => void;  // filter change
  onAdd: () => void;                              // Function for adding a vendor
  filteredCount: number;                         // filtered vendor count
  onSearch: (text: string) => void;             // search function
}

export default function VendorFilters({
  showOnlyHomologados,
  setShowOnlyHomologados,
  onAdd,
  filteredCount,
  onSearch,
}: Props) {
  return (
    <View style={styles.filterSection}>

      {/* Button to alternate showing only validated */}
      <Pressable
        style={styles.filterVendorPressable}
        onPress={() => setShowOnlyHomologados(!showOnlyHomologados)}
      >
        <Text style={styles.PressableText}>
          {showOnlyHomologados ? 'Show all vendors' : 'Show only validated'}
        </Text>
      </Pressable> 

      {/* Button for adding new vendor */}
      <Pressable style={styles.filterVendorPressable} onPress={onAdd}>
        <Text style={styles.PressableText}>Add new vendor</Text>
      </Pressable>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search vendors by name or email..."
          onChangeText={onSearch}
          style={{ flex: 1 }}
          returnKeyType="search"
        />
      </View>

      {/* Vendors showing count */}
      <Text style={[styles.vendorCountText]}>
        Showing {filteredCount} vendor{filteredCount !== 1 ? 's' : ''}
      </Text>
    </View>
  );
}
