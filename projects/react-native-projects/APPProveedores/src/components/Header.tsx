import React from 'react';
import { View, Text } from 'react-native';
import styles from '../app/Styles';

export default function Header() {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>Vendor List</Text>
    </View>
  );
}
