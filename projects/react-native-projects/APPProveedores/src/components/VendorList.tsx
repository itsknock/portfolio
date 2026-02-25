// VendorList.tsx - Responsive vendor list using FlatList
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, Dimensions } from 'react-native';
import ItemVendor from './ItemVendor';
import styles from '../app/Styles';
import type { Proveedor } from '../app/Types';

interface Props {
  proveedores: Proveedor[];           // array of vendors
  loading: boolean;                   // loading state
  onDelete: (no: string) => void;     // delete callback
  onEdit: (no: string) => void;       // edit callback
}

export default function VendorList({ proveedores, loading, onDelete, onEdit }: Props) {
  const gap = 12; // spacing between items
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);
  const [numColumns, setNumColumns] = useState(screenWidth > 600 ? 2 : 1); // responsive columns

  // Update number of columns on screen resize
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
      setNumColumns(window.width > 600 ? 2 : 1);
    });
    return () => subscription?.remove();
  }, []);

  return (
    <View style={{ flex: 1, paddingHorizontal: 50 }}>
      <View style={{ height: Dimensions.get('window').height * 0.7 }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={proveedores}
            keyExtractor={(item) => item.no}          // use vendor no as key
            key={numColumns}                          // re-render on column change
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between', marginBottom: 10 } : undefined}
            renderItem={({ item, index }) => (
              <View style={{
                marginHorizontal: gap / 2,
                flexBasis: numColumns > 1 ? '35%' : '100%', // width per column
                flexGrow: 1,
              }}>
                <ItemVendor
                  proveedor={item}
                  onDelete={onDelete}
                  onEdit={onEdit}                          // pass vendor no
                  isHomologado={item.estadoHomologacion === 'Homologado'}
                />
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No available Vendors.</Text>}
            initialNumToRender={10} // render first 10 for performance
          />
        )}
      </View>
    </View>
  );
}
