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

      {/* Performance Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Performance</ThemedText>
        
      </ThemedView>

      {/* Recent Activity Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        
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
    height: 175,
    width: 175,
    bottom: 0,
    left: 35,
    position: "absolute",
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
