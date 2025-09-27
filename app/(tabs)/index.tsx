import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

export default function DashBoard() {
  const [agents, setAgents] = useState([
    { id: 1, name: "Prescription Monitor", status: "unknown" },
    { id: 2, name: "Patient Adherence", status: "unknown" },
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
        <ThemedText type="title">Pharmaceutical Management</ThemedText>
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
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>

      {/* Recent Activity Section */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Recent Activity</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText>{" "}
          to get a fresh <ThemedText type="defaultSemiBold">app</ThemedText>{" "}
          directory. This will move the current{" "}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{" "}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
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
    height: 200,
    width: 400,
    bottom: 0,
    left: -100,
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
