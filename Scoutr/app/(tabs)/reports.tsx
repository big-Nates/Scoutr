import React from "react";
import { FlatList, View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";


  

// Sample team data
const teams = [
  { id: "130", status: "Maintenance", statusColor: "blue" },
  { id: "130", status: "Major Error", statusColor: "red" },
  { id: "13000", status: null, statusColor: null },
];

export default function App() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Scouting</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.ratingButton}>
            <Text style={styles.ratingText}>Rating</Text>
            <Ionicons name="chevron-down" size={18} />
          </TouchableOpacity>
          <Ionicons name="menu" size={24} />
        </View>
      </View>

      {/* Team Cards */}
      <FlatList
        data={teams}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Top row */}
            <View style={styles.cardTopRow}>
              <Text style={styles.teamPill}>#{item.id}</Text>
              <Ionicons name="clipboard-outline" size={22} />
            </View>

            {/* Status */}
            {item.status && (
              <View
                style={[
                  styles.statusBox,
                  { backgroundColor: item.statusColor },
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            )}

            {/* Footer */}
            <View style={styles.cardFooter}>
              <Text style={styles.footerText}>Play-Style</Text>
              <Text style={styles.footerText}>Auto Scoring</Text>
              <Text style={styles.footerText}>Tele-Op Scoring</Text>
            </View>
          </View>
        )}
      />

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff7f7", // soft rose background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff7f7",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    marginRight: 4,
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: "#e5e7eb",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamPill: {
    backgroundColor: "#fca5a5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  statusBox: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,

  },
  statusText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    backgroundColor: "#fca5a5",
    paddingVertical: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  footerText: {
    fontSize: 14,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff7f7",
  },
});

const boxSizing = [];



