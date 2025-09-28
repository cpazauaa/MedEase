import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

type InventoryItem = {
  medication: string;
  currentStock: number;
  reorderStatus: 'OK' | 'Reorder';
  supplier: string;
  contact: string;
};

export default function TabTwoScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Simulate fetching data
  useEffect(() => {
    const fetchInventory = async () => {
      // Replace this with your API query
      const data: InventoryItem[] = [
        { medication: 'Aspirin', currentStock: 120, reorderStatus: 'OK', supplier: 'HealthCorp', contact: '123-456-7890' },
        { medication: 'Paracetamol', currentStock: 20, reorderStatus: 'Reorder', supplier: 'MediSupply', contact: '987-654-3210' },
        { medication: 'Ibuprofen', currentStock: 75, reorderStatus: 'OK', supplier: 'PharmaPlus', contact: '555-555-5555' },
      ];
      setInventory(data);
    };

    fetchInventory();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a08787ff', dark: '#ffffffff' }}
      headerImage={
        <Image
          source={require('@/assets/images/int.png')}
          style={styles.meLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Inventory Tablet
        </ThemedText>
      </ThemedView>

      <ScrollView horizontal style={{ marginHorizontal: 16 }}>
        <View style={styles.table}>
          {/* Header Row */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.headerText]}>Medication</Text>
            <Text style={[styles.cell, styles.headerText]}>Current Stock</Text>
            <Text style={[styles.cell, styles.headerText]}>Reorder Status</Text>
            <Text style={[styles.cell, styles.headerText]}>Supplier</Text>
            <Text style={[styles.cell, styles.headerText]}>Contact</Text>
          </View>

          {/* Data Rows */}
          {inventory.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cell}>{item.medication}</Text>
              <Text style={styles.cell}>{item.currentStock}</Text>
              <Text style={[styles.cell, item.reorderStatus === 'Reorder' ? styles.reorder : {}]}>
                {item.reorderStatus}
              </Text>
              <Text style={styles.cell}>{item.supplier}</Text>
              <Text style={styles.cell}>{item.contact}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  meLogo: {
    height: 70,
    width: 70,
    bottom: 0,
    left: 30,
    position: 'absolute',
  },
  table: {
  borderWidth: 1,
  borderColor: '#ccc',
  marginVertical: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  overflow: 'hidden', // ensures row borders respect rounding
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3, // for Android shadow
},
  tableRow: {
  flexDirection: 'row',
  borderBottomWidth: 1,
  borderColor: '#e0e0e0',
  backgroundColor: '#fff', // default for even rows
},
tableRowEven: {
  backgroundColor: '#110f0fff',
},
  tableHeader: {
  backgroundColor: '#131616ff',
  color: '#4a34a1ff',
  fontWeight: 'bold',
  fontSize: 16,
  paddingVertical: 10,
},
  cell: {
  paddingVertical: 10,
  paddingHorizontal: 12,
  minWidth: 120,
  textAlign: 'center',
  fontSize: 14,
},
  headerText: {
    fontWeight: 'bold',
    color: '#f1f1f1',
  },
  reorder: {
  color: '#d32f2f',
  fontWeight: 'bold',
  backgroundColor: '#ffebee',
  borderRadius: 4,
  paddingHorizontal: 4,
},
});
