import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './(tabs)/index';
type Props = {
  route: RouteProp<RootStackParamList, 'MedicineDetails'>;
};
const MED_DETAILS_URL = 'https://YOUR_CLOUD_RUN_URL/medicine-details'; // Replace for full medicine info from BigQuery
const MedicineDetails: React.FC<Props> = ({ route }) => {
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${MED_DETAILS_URL}?id=${route.params.medicineId}`)
      .then(res => res.json())
      .then(data => setMedicine(data.medicine))
      .catch(() => setMedicine(null))
      .finally(() => setLoading(false));
  }, [route.params.medicineId]);
  if (loading) {
    return <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />;
  }
  if (!medicine) {
    return <View style={styles.container}><Text>Medicine not found.</Text></View>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{medicine.name}</Text>
      <Text style={styles.desc}>{medicine.description || 'No information available.'}</Text>
      <Text style={styles.info}>Stock: {medicine.stock}</Text>
      <Text style={styles.info}>Barcode: {medicine.barcode || 'N/A'}</Text>
    </View>
  );
};
export default MedicineDetails;
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#ffffff" },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 8 },
  desc: { fontSize: 16, marginBottom: 10, textAlign: "center", color: "#525252" },
  info: { fontSize: 16, marginBottom: 5 }
});