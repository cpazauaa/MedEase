// screens/PharmacyHomeScreen.tsx
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function PharmacyHomeScreen() {
  const [agentStatus, setAgentStatus] = useState("Idle");

  const runAgent = async () => {
    setAgentStatus("Running");
    await new Promise((res) => setTimeout(res, 2000));
    setAgentStatus("Idle");
  };

  const recentActivity = [
    "Prescription RX-004 marked Ready",
    "Insurance escalation initiated for RX-003",
    "Patient P-2847 picked up RX-001",
    "Inventory Alert: Low stock on Omeprazole",
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#a08787ff", dark: "#ffffffff" }}
      headerImage={<Image source={require("@/assets/images/melogo.png")} style={styles.meLogo} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Dashboard</ThemedText>
      </ThemedView>

      {/* Agent Status */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Agents</Text>
        <Text style={styles.status}>
          Status:{" "}
          <Text
            style={
              agentStatus === "Running"
                ? styles.running
                : agentStatus === "Error"
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
      <ThemedView style={styles.cardContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        {recentActivity.map((item, index) => (
          <ThemedView key={index} style={styles.activityCard}>
            <Text style={styles.activityText}>{item}</Text>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  meLogo: { height: 220, width: 220, bottom: -20, left: 20, position: "absolute", borderRadius: 90 },
  titleContainer: { marginBottom: 20, paddingHorizontal: 16 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#b30000", marginBottom: 10 },
  status: { fontSize: 16, marginBottom: 12, color: "#444" },
  idle: { color: "#ff9800", fontWeight: "bold" },
  running: { color: "#4caf50", fontWeight: "bold" },
  error: { color: "#d32f2f", fontWeight: "bold" },
  cardContainer: { paddingHorizontal: 16, marginBottom: 24 },
  activityCard: { padding: 14, marginTop: 6, borderRadius: 12, backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 3, elevation: 2 },
  activityText: { fontSize: 14, color: "#333" },
});
