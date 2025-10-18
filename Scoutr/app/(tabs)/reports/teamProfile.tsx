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
  const { team_number, team_name, } = params;
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
      // Define an async function *inside* useEffect
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
  
      // Call the async function
      fetchData();
    }, []); // Empty dependency array = run once

    if (loading) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
      }
  return (
    <ProtectedRoute>
      <View style={styles.main}>
      <View style={styles.navBar}>
        <MaterialCommunityIcons name="chevron-left" size={40} color="#000000ff" onPress={() => router.navigate("/(tabs)/reports")} />
      </View>
      <ScrollView style={styles.infoScroll} contentContainerStyle={{alignItems: "center"}}>
        <View style={styles.teamInfo}>
          <View style={styles.teamQuickInfo}>
            <View style={styles.teamImage}>

            </View>
            
            <View style={styles.teamOptions}>
              <View style={styles.teamStatus}>
                <Text>
                  Status
                </Text>
                <View>
                  
                </View>
              </View>
              <View style={{justifyContent:"space-around", alignItems:"center",}}>
                <Text style={{}}>
                  Team #{team_number} {team_name}
                </Text>
                <TouchableOpacity style={styles.button} onPress={() => alert('Pressed!')}>
                  <Text>Team Report</Text>
                  <MaterialCommunityIcons style={{padding:0, justifyContent: "center", alignItems:"center"}} name="information" size={20} color="#000000ff" onPress={() => router.back()} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.teamReliability}>
                <Text>
                  Reliability Score
                </Text>
                <View>
                  
                </View>
              </View>
            </View>
          </View>
          
        </View>

        {/* <View style={styles.statsInfo}>
          <Text style={styles.title}>
            Team Statistics
          </Text>
          <View style={styles.header}>
              <Text style={styles.headerText}>
                Statstic
              </Text>
              <Text style={styles.headerText}>

              </Text>
              <Text style={styles.headerText}>

              </Text>
            </View>
          <ScrollView style={styles.statsTable}>
            <View>
              <FlatList
                data={reports}
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <View style={styles.headerText}>

                    </View>
                    <View style={styles.headerText}>

                    </View>
                    <View style={styles.headerText}>

                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.team_number.toString()}
                numColumns={1}
              />
              
              
            </View>
          </ScrollView>
        </View> */}

        <View style={styles.reportsInfo}>
          <Text style={styles.title}>
            Match Reports
          </Text>
          <View>
            <ScrollView style={styles.statsTable}>
              <FlatList
              data={reports}
              renderItem={({ item }) => (
                
                <View style={styles.statBox}></View>
              )}
              keyExtractor={(item) => item.team_number.toString()}
              numColumns={1}
              />
            </ScrollView>
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
      margin:0,
      padding:0,
      flexDirection:"column", 
      backgroundColor:"#FFF9F1",
    },
    navBar:{
      paddingTop:10,
      justifyContent: "center",
      paddingLeft: 25,
    },
    
    infoScroll:{
      paddingBottom: 50,
    },
    teamInfo:{
      alignItems: "center",
      
    },
    teamQuickInfo:{
      width: width * 0.75,
      height: height * 0.6,
      backgroundColor: '#ffe99fff',
      borderRadius: 30,
      alignItems:"center",
      justifyContent:"space-between",
      
    },
    teamOptions:{
      flexDirection: "row",
      width:"100%",
      justifyContent:"space-around",
      height: height * 0.15,
    },
    teamImage:{
      width:width * 0.7,
      height:height * 0.45,
    },
    button:{
      height: height * 0.055,
      width: width * 0.095,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 5,
      paddingLeft:5,
      paddingRight:5,
      backgroundColor: "red"
    },
    teamStatus:{
      justifyContent:"center",
      alignItems:"center"
    },
    teamReliability:{
      justifyContent:"center",
      alignItems:"center"
    },
    statsInfo:{
      alignItems: "center",
      marginTop: width * 0.02,
      width: width * 0.75,
      backgroundColor: "#ffe99fff",
      paddingBottom: 30,
      paddingTop: 10,
      borderRadius: 30
    },
    statsTable:{
      width: width * 0.7,
      height: height * 0.33,
      backgroundColor: "grey",
    },
    title:{
      fontSize: 20,
      width: width * 0.7
    },
    header:{
      width: width * 0.7,
      height: height * 0.07,
      backgroundColor: "blue",
      flexDirection: "row",
    },
    headerText:{
      flex: 1,
      borderWidth: 1,
    },
    row:{
      width: width * 0.7,
      height: height * 0.075,
      flexDirection: "row",
    },
    rowText:{
      
    },
    statBox:{
      width: width * 0.7,
      height: height * 0.05,
      backgroundColor: "orange",
      borderWidth: 1,
    },
    reportsInfo:{
      alignItems: "center",
      marginTop: width * 0.02,
      width: width * 0.75,
      backgroundColor: "#ffe99fff",
      paddingBottom: 30,
      paddingTop: 10,
      borderRadius: 30
    }
  })