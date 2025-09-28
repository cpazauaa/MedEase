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
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          Insurance Management
        </ThemedText>
      </ThemedView>

      <View style={styles.table}>
      
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
      return { backgroundColor: "#014b1bff" }; // green
    case "Processing":
      return { backgroundColor: "#e1b720ff" }; // yellow
    case "Denied":
      return { backgroundColor: "#8B0000" }; // red
    default:
      return { backgroundColor: "#aaa" }; // gray
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 16,
  },
  meLogo: {
    height: 60,
    width: 60,
    bottom: 0,
    left: 30,
    position: "absolute",
  },
  table: {
    borderTopWidth: 1,
    borderColor: "#444",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#444",
    paddingVertical: 8,
  },
  striped: {
    backgroundColor: "#282323ff",
  },
  headerRow: {
    backgroundColor: "#111",
  },
  headerCell: {
    flex: 1,
    padding: 8,
    fontWeight: "bold",
    color: "white",
    fontSize: 12,
  },
  cell: {
    flex: 1,
    padding: 8,
    fontSize: 12,
    color: "white",
  },
  statusCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
});
