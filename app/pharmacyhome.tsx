import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from './(tabs)/index'; // adjust the path to where RootStackParamList is defined

type PharmacyHomeProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PharmacyHome'>;
};

const PharmacyHome: React.FC<PharmacyHomeProps> = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Welcome to AI Pharmacy</Text>
    <Text style={styles.subtitle}>
      Smart assistant for medicine lookup, inventory, Q&A, and order management.
    </Text>

    <View style={styles.buttonContainer}>
      <Button
        title="Check the Inventory"
        onPress={() => navigation.navigate('MedicineInventory')}
      />
    </View>

    <Text style={styles.subtitle}>
      Use the button below to chat with our AI agent.
    </Text>
    <View style={styles.buttonContainer}>
      <Button
        title="Chat with AI Agent"
        onPress={() => navigation.navigate('AgentChat')}
      />
    </View>
  </View>
);

export default PharmacyHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1b4965',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#525252',
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 14,
    width: 220,
  },
});
