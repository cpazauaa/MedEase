import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PharmacyHome from '../pharmacyhome';
import MedicineDetails from '../medicine_details';
import MedicineInventory from '../medicine_inventory';
export type RootStackParamList = {
  PharmacyHome: undefined;
  MedicineInventory: undefined;
  MedicineDetails: { medicineId: string };
};
const Stack = createStackNavigator<RootStackParamList>();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PharmacyHome">
        <Stack.Screen name="PharmacyHome" component={PharmacyHome} options={{ title: 'AI Pharmacy Home' }} />
        <Stack.Screen name="MedicineDetails" component={MedicineDetails} options={{ title: 'Medicine Details' }} />
        <Stack.Screen name="MedicineInventory" component={MedicineInventory} options={{ title: 'Medicine Inventory' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}