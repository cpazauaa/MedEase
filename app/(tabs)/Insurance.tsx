import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";

export default function TabTwoScreen() {
  const insuranceData = [
    { id: "INS-001", medication: "Lisinopril 10mg", patient: "P-2847", status: "Approved", autoEscalation: false },
    { id: "INS-002", medication: "Metformin 500mg", patient: "P-1923", status: "Processing", autoEscalation: true },
    { id: "INS-003", medication: "Atorvastatin 20mg", patient: "P-3456", status: "Denied", autoEscalation: true },
    { id: "INS-004", medication: "Omeprazole 40mg", patient: "P-5678", status: "Approved", autoEscalation: false },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#a08787ff", dark: "#ffffffff" }}
      headerImage={
        <Image
          source={require("@/assets/images/insur.png")}
          style={styles.meLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
          Insurance Management
        </ThemedText>
      </ThemedView>

      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={styles.headerCell}>ID</Text>
          <Text style={styles.headerCell}>Medication</Text>
          <Text style={styles.headerCell}>Patient</Text>
          <Text style={styles.headerCell}>Status</Text>
          <Text style={styles.headerCell}>Escalation</Text>
        </View>

        {/* Data Rows */}
        {insuranceData.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.row,
              index % 2 === 0 && styles.striped,
            ]}
          >
            <Text style={styles.cell}>{item.id}</Text>
            <Text style={styles.cell}>{item.medication}</Text>
            <Text style={styles.cell}>{item.patient}</Text>

            <View style={[styles.cell, styles.statusCell]}>
              <View style={[styles.badge, getBadgeStyle(item.status)]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>

            <Text style={styles.cell}>
              {item.autoEscalation ? "⚠️ Yes" : "—"}
            </Text>
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

function getBadgeStyle(status: string) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#2e7d32" }; // green
    case "Processing":
      return { backgroundColor: "#f9a825" }; // yellow
    case "Denied":
      return { backgroundColor: "#c62828" }; // red
    default:
      return { backgroundColor: "#9e9e9e" }; // gray
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  meLogo: {
    height: 130,
    width: 130,
    bottom: 0,
    left: 30,
    position: "absolute",
  },
  table: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    backgroundColor: "#fff",
  },
  striped: {
    backgroundColor: "#fafafa",
  },
  headerRow: {
    backgroundColor: "#b30000", // pharma red
  },
  headerCell: {
    flex: 1,
    padding: 12,
    fontWeight: "bold",
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    padding: 12,
    fontSize: 13,
    color: "#333",
    textAlign: "center",
  },
  statusCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: "center",
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
});
