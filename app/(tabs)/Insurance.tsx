import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#a08787ff', dark: '#ffffffff' }}
                  headerImage={
                    <Image
                      source={require('@/assets/images/insur.png')}
                      style={styles.meLogo}
                    />
                  }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Insurance
        </ThemedText>
      </ThemedView>
    
    </ParallaxScrollView>
  );
}
/* Helper: Badge styling by status */
function getBadgeStyle(status: string) {
  switch (status) {
    case "Approved":
      return { backgroundColor: "#014b1bff" };
    case "Processing":
      return { backgroundColor: "#333" };
    case "Denied":
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
    borderRadius: 6,
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
    padding: 10,
    fontWeight: "bold",
    color: "white",
  },
  cell: {
    flex: 1,
    padding: 10,
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