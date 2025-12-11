import React, {useState, useEffect} from "react";
import { View, Text, Button, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity, FlatList, ActivityIndicator, } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/app/api/client";


const { width, height } = Dimensions.get("screen");
export default function TeamProfile() {
  const params = useGlobalSearchParams();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState("Team"); // default
  const { team_number} = params;
  // Sample team data
  

    const [reports, setReports] = useState<{
      _id: number;
      team_number: number;
      team_name: string;
      profile_img_url: string;
      classified_amount_auto: number;
      can_collect_from_human_player: boolean;
      can_deposit_close: boolean;
      can_deposit_far: boolean;
    }[]>([]);
  
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const fetchData = async () => {
        try {
          const json = await api.get('match_reports/'+team_number); 
          setReports(json.data);
          console.log(json);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }
    return (
      <ProtectedRoute>
        <View style={styles.main}>
        <ScrollView style={styles.infoScroll}>
          <View style={styles.teamInfo}>
            <View style={styles.navBar}>
              <MaterialCommunityIcons name="chevron-left" size={40} color="#000000ff" onPress={() => router.navigate("/(tabs)/reports")} />
            </View>
            <Text style={styles.teamHeader}>
              Team #00000 - Robotics Team Name
            </Text>
          </View>
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatText}>
                Team Rank
              </Text>
              <Text style={styles.quickStatText}>
                #00000
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatText}>
                Auto Rank
              </Text>
              <Text style={styles.quickStatText}>
                #00000
              </Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatText}>
                Teleop Rank
              </Text>
              <Text style={styles.quickStatText}>
                #00000
              </Text>
            </View>
          </View>
          
          <ScrollView style={styles.generalStats}>
            <View style={styles.generalStatsHeader}>
              <Text style={styles.generalStatsType}>
                Event Data
              </Text>
              <View style={styles.generalStatsFilter}>
                <View style={styles.eventFilterView}>
                  <Text>
                    USCTCMP
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
                </View>
                <View style={styles.statsTypeFilter}>
                  <Text>
                    Event
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
                </View>
              </View>
            </View>
            <View style={styles.generalStatsBody}>
              <View style={styles.generalStatsTopRowView}>
                <Text style={styles.generalStatsRowHeader}>
                  Teleop Averages
                </Text>
                <View style={styles.generalStatsRow}>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.generalStatsRowView}>
                <Text style={styles.generalStatsRowHeader}>
                  Auto Averages
                </Text>
                <View style={styles.generalStatsRow}>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.generalStatsRowView}>
                <Text style={styles.generalStatsRowHeader}>
                  Accuracy Averages
                </Text>
                <View style={styles.generalStatsRow}>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                  <View style={styles.generalStatsRowEntry}>
                    <Text style={styles.generalStatsRowEntryHeader}>

                    </Text>
                    <Text style={styles.generalStatsRowEntryData}>

                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.reportQuerySection}>
            <View style={styles.matchReportSearch}>

            </View>
            <View style={styles.matchReportView}>

            </View>
          </View>
        </ScrollView>
      </View>
      </ProtectedRoute>
      
    );
}
const styles = StyleSheet.create({
    main:{
      flex: 1,
      flexDirection:"column", 
      backgroundColor:"#FFF9F1",
    },
    
    infoScroll:{
      flex: 1,
      paddingBottom: 50,
    },
    teamInfo:{
      height: height * 0.1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    navBar:{
      justifyContent: "center",
      position: "absolute",
      left: 20,
      top: 17
    },
    teamHeader:{
      fontSize: 30,
      
    },
    quickStats:{
      width: width * 0.45,
      height: height * 0.15,
      marginTop: height * 0.025,
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    quickStat:{
      width: width * 0.45 * 0.3,
      height: height * 0.15 * 0.85,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
    },
    quickStatText:{
      fontSize: 20,
    },
    generalStats:{
      width: width * 0.85,
      height: height * 0.5,
      marginTop: height * 0.05,
      alignSelf: "center",
      borderWidth: 2,
      borderRadius: 15,
    },
    generalStatsHeader:{
      width: width * 0.82,
      height: height * 0.5 * 0.15,
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    generalStatsType:{
      fontSize: 20,
    },
    generalStatsFilter:{
      width: width * 0.82 * 0.2,
      height: height * 0.5 * 0.1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    eventFilterView:{
      height: height * 0.5 * 0.1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "gray",
      paddingLeft: 5,
    },
    statsTypeFilter:{
      height: height * 0.5 * 0.1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "gray",
      paddingLeft: 5,
    },
    generalStatsBody:{
      width: width * 0.82,
      alignSelf: "center",
      flexDirection: "column",
      justifyContent: "space-evenly",
    },
    generalStatsTopRowView:{
      width: width * 0.82,
      height: height * 0.5 * 0.83 * 0.4,
      marginTop: 10,
      marginBottom: height * 0.5 * 0.83 * 0.1,
    },
    generalStatsRowView:{
      width: width * 0.82,
      height: height * 0.5 * 0.83 * 0.4,
      marginBottom: height * 0.5 * 0.83 * 0.1,
    },
    generalStatsRowHeader:{
      fontSize: 20
    },
    generalStatsRow:{
      height: height * 0.5 * 0.83 * 0.35,
      width: width * 0.82,
    },
    generalStatsRowEntry:{
      height: height * 0.5 * 0.83 * 0.35,
      width: width * 0.82 * 0.3,
      flexDirection: "column",
      justifyContent: "space-between"
    },


    
  })