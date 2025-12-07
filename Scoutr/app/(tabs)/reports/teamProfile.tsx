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
              Helo World
            </Text>
          </View>
          <View style={styles.quickStats}>

          </View>
          
          <View style={styles.generalStats}>

          </View>
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
      backgroundColor: "gray",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    },
    navBar:{
      justifyContent: "center",
      position: "absolute",
      left: 10,
      top: 17
    },
    teamHeader:{
      fontSize: 30,
      
    }

    
  })