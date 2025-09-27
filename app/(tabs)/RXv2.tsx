import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons"; // for warning icon
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export default function TabTwoScreen() {
  const prescriptions = [
    {
      rxId: "RX-001",
      medication: "Lisinopril 10mg",
      patientId: "P-2847",
      status: "Ready",
      warning: false,
    },
    {
      rxId: "RX-002",
      medication: "Metformin 500mg",
      patientId: "P-1923",
      status: "Waiting Pickup",
      warning: true,
      inactive: true,
    },
    {
      rxId: "RX-003",
      medication: "Atorvastatin 20mg",
      patientId: "P-3456",
      status: "Pending Insurance",
      warning: false,
    },
    {
      rxId: "RX-004",
      medication: "Omeprazole 40mg",
      patientId: "P-5678",
      status: "Ready",
      warning: false,
    },
    {
      rxId: "RX-005",
      medication: "Amlodipine 5mg",
      patientId: "P-7890",
      status: "Waiting Pickup",
      warning: true,
      inactive: true,
    },
  ];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#a08787ff", dark: "#ffffffff" }}
      headerImage={
        <Image
          source={require("@/assets/images/images.png")}
          style={styles.meLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{ fontFamily: Fonts.rounded }}
        >
          Prescription Management
        </ThemedText>
      </ThemedView>

      {/* Table */}
      <View style={styles.table}>
        {/* Header row */}
        <View style={[styles.row, styles.headerRow]}>
          <ThemedText style={[styles.headerCell]}>RX ID</ThemedText>
          <ThemedText style={[styles.headerCell, { flex: 2 }]}>Medication</ThemedText>
          <ThemedText style={styles.headerCell}>Patient</ThemedText>
          <ThemedText style={styles.headerCell}>Status</ThemedText>
        </View>

        {/* Data rows */}
        {prescriptions.map((p, index) => (
          <View
            key={index}
            style={[
              styles.row,
              index % 2 === 1 ? styles.striped : null, // alternating bg
              p.inactive ? styles.inactiveRow : null, // faded if inactive
            ]}
          >
            <ThemedText style={styles.cell}>{p.rxId}</ThemedText>
            <ThemedText style={[styles.cell, { flex: 2 }]}>{p.medication}</ThemedText>
            <ThemedText style={styles.cell}>{p.patientId}</ThemedText>

            {/* Status badge + optional warning */}
            <View style={[styles.cell, styles.statusCell]}>
              <View style={[styles.badge, getBadgeStyle(p.status)]}>
                <ThemedText style={styles.badgeText}>{p.status}</ThemedText>
              </View>
              {p.warning && (
                <Ionicons name="warning-outline" size={18} color="red" style={{ marginLeft: 6 }} />
              )}
            </View>
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  );
}

/* Helper: Badge styling by status */
function getBadgeStyle(status: string) {
  switch (status) {
    case "Picked Up":
      return { backgroundColor: "#000000ff" };
    case "Ready":
      return { backgroundColor: "#014b1bff" };
    case "In Process":
      return { backgroundColor: "#333" };
    case "Pending Insurance":
      return { backgroundColor: "#8B0000" };
    default:
      return { backgroundColor: "#aaa" };
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 16,
  },
  meLogo: {
    height: 50,
    width: 50,
    bottom: 0,
    left: 30,
    position: "absolute",
  },
  table: {
    borderTopWidth: 1,
    borderColor: "#444",
    borderRadius: 5,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#444",
  },
  striped: {
    backgroundColor: "#282323ff",
  },
  inactiveRow: {
    opacity: 0.5,
  },
  headerRow: {
    backgroundColor: "#111",
  },
  headerCell: {
    flex: 1,
    padding: 5,
    fontWeight: "bold",
    color: "white",
  },
  cell: {
    flex: 1,
    padding: 5,
  },
  statusCell: {
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
