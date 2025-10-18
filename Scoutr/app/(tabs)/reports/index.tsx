import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import TeamCard from "@/components/TeamReportIcon";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/app/api/client";

const { width, height } = Dimensions.get("screen");

let cards = Platform.OS === "web" ? 2 : 1;

type Team = {
  _id: number;
  team_number: number;
  team_name: string;
  profile_img_url: string;
  classified_amount_auto: number;
  can_collect_from_human_player: boolean;
  can_deposit_close: boolean;
  can_deposit_far: boolean;
};

export default function Reports() {
  const [reports, setReports] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  // Fetch reports once on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.get("self_reports/");
        setReports(data.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filtered reports based on search query
  const filteredReports = query
    ? reports.filter((r) =>
        r.team_number.toString().toLowerCase().includes(query.toLowerCase())
      )
    : reports;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.main}>
        {/* Filter/Search Bar */}
        <View style={styles.filterBar}>
          <View style={styles.filters}>
            <Text style={styles.filterBarLeft}>Team Reports</Text>
            <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
          </View>

          <View style={styles.filterBarRight}>
            <View style={styles.filters}>
              <Text>Rating</Text>
              <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
            </View>
            <View style={styles.filters}>
              <MaterialIcons name="menu" size={30} color="#25292e" />
              <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
            </View>
            <View style={styles.searchBox}>
              <TextInput
                placeholder="Search Team Name"
                value={query}
                onChangeText={setQuery}
                autoCapitalize="none"
              />
            </View>
          </View>
        </View>

        {/* Reports List */}
        <FlatList
          data={filteredReports}
          renderItem={({ item }) => <TeamCard data={item} />}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 50,
          }}
          numColumns={cards}
        />
      </View>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#FFF9F1",
  },
  filterBar: {
    height: "10%",
    backgroundColor: "#FFF9F1",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: width * 0.066,
    paddingRight: width * 0.066,
    alignItems: "center",
  },
  filterBarRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.3,
    alignItems: "center",
  },
  filterBarLeft: {
    fontSize: 20,
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  searchBox: {
    width: width * 0.15,
    height: height * 0.05,
    backgroundColor: "white",
    borderRadius: 25,
    justifyContent: "center",
    paddingLeft: 17,
    paddingRight: 17,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
