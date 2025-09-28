import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ChatScreen from './Agents';

export type RootStackParamList = {
  PharmacyHome: undefined;
  AgentChat: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="PharmacyHome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PharmacyHome" component={PharmacyHomeScreen} />
      <Stack.Screen name="AgentChat" component={ChatScreen} />
    </Stack.Navigator>
  );
}

// PharmacyHomeScreen includes the dashboard
function PharmacyHomeScreen() {
  const [agentStatus, setAgentStatus] = useState('Idle');

  const runAgent = async () => {
    setAgentStatus('Running');
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // simulate task
      setAgentStatus('Idle');
    } catch (error) {
      setAgentStatus('Error');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#a08787ff", dark: "#ffffffff" }}
      headerImage={<Image source={require("@/assets/images/melogo.png")} style={styles.meLogo} />}
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">AI Pharmaceutical Management</ThemedText>
      </ThemedView>

      {/* Agent Status */}
      <View style={styles.container}>
        <Text style={styles.title}>Agent Dashboard</Text>
        <Text style={styles.status}>
          Status:{" "}
          <Text
            style={
              agentStatus === 'Running'
                ? styles.running
                : agentStatus === 'Error'
                ? styles.error
                : styles.idle
            }
          >
            {agentStatus}
          </Text>
        </Text>
        <Button title="Run Agent" onPress={runAgent} />
      </View>

      {/* Recent Activity */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        {[
          "Prescription RX-004 marked Ready",
          "Insurance escalation initiated for RX-003",
          "Patient P-2847 picked up RX-001",
          "Inventory Alert: Low stock on Omeprazole",
        ].map((activity, index) => (
          <ThemedView key={index} style={styles.activityCard}>
            <ThemedText style={styles.activityText}>{activity}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  stepContainer: {
    gap: 10,
    marginBottom: 8,
    padding: 16,
  },
  meLogo: {
    height: 250,
    width: 250,
    bottom: -30,
    left: 25,
    position: "absolute",
  },
  activityCard: {
    backgroundColor: "#302e2eff",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  activityText: {
    fontSize: 14,
    color: "#ffffffff",
  },
  container: { backgroundColor: '#302e2eff', padding: 20, borderRadius: 12},
  title: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  status: { color: 'white', fontSize: 16, marginBottom: 12 },
  idle: { color: 'orange', fontWeight: 'bold' },
  running: { color: 'green', fontWeight: 'bold' },
  error: { color: 'red', fontWeight: 'bold' },
});

