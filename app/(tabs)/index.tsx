import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function DashBoard() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Prescription Monitor", status: "unknown" },
    { id: 3, name: "Insurance Escalation", status: "unknown" },
    { id: 4, name: "Inventory Alert", status: "unknown" },
    { id: 5, name: "Notification Agent", status: "unknown" },
  ]);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#a08787ff", dark: "#ffffffff" }}
      headerImage={
        <Image
          source={require("@/assets/images/melogo.png")}
          style={styles.meLogo}
        />
      }
    >
      {/* Title Section */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">AI Pharmaceutical Management</ThemedText>
      </ThemedView>

      {/* Agent Status */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Agent Status</ThemedText>
        {agents.map((agent) => (
          <ThemedText key={agent.id}>
            {agent.name}: {getStatusIcon(agent.status)}
          </ThemedText>
        ))}
      </ThemedView>

      {/* Recent Activity Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>

        {["Prescription RX-004 marked Ready",
    "Insurance escalation initiated for RX-003",
    "Patient P-2847 picked up RX-001",
    "Inventory Alert: Low stock on Omeprazole"]

    .map((activity, index) => (
      <ThemedView key={index} style={styles.activityCard}>
        <ThemedText style={styles.activityText}>{activity}

        </ThemedText>
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
    height: 190,
    width: 190,
    bottom: 0,
    left: 30,
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
});

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return "🟢 Active";
    case "idle":
      return "🟡 Idle";
    case "offline":
      return "🔴 Offline";
    default:
      return "⚪ Unknown";
  }
};
