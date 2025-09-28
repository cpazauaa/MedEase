import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './(tabs)/index';

type Medicine = {
  id: string;
  name: string;
  stock: number;
  description?: string;
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'PharmacyHome'>;
};

const INVENTORY_ENDPOINT = 'https://YOUR_CLOUD_RUN_URL/inventory'; // Proxy serving BigQuery results

const MedicineInventory: React.FC<Props> = ({ navigation }) => {
  const [inventory, setInventory] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(INVENTORY_ENDPOINT)
      .then(res => res.json())
      .then(data => setInventory(data.medicines || []))
      .catch(() => setInventory([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = inventory.filter(med =>
    med.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medicine Inventory</Text>
      <TextInput
        style={styles.searchBox}
        placeholder="Search medicine..."
        value={search}
        onChangeText={setSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.medicineCard}
              onPress={() => navigation.navigate('MedicineDetails', { medicineId: item.id })}
            >
              <Text style={styles.medicineName}>{item.name}</Text>
              <Text style={styles.medicineStock}>Stock: {item.stock}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default MedicineInventory;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121313ff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#153243' },
  searchBox: { borderWidth: 1, borderColor: '#0b0b0bff', borderRadius: 6, marginBottom: 16, padding: 8 },
  medicineCard: { padding: 15, backgroundColor: '#000000ff', borderRadius: 10, marginVertical: 6 },
  medicineName: { fontSize: 18, fontWeight: '500' },
  medicineStock: { color: '#13505b' }
});