import { View, Text, Button, StyleSheet, ScrollView, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const { width, height } = Dimensions.get("screen");
export default function TeamProfile() {
  const router = useRouter();

  return (
    <View style={styles.main}>
      <View style={styles.navBar}>
        <MaterialCommunityIcons style={{padding:0, justifyContent: "center", alignItems:"center"}} name="chevron-left" size={40} color="#000000ff" onPress={() => router.back()} />
      </View>
      <ScrollView style={styles.infoScroll}>
        <View style={styles.teamInfo}>
          <View style={styles.teamQuickInfo}>
            <View style={styles.teamImage}>

            </View>
            <Text style={styles.teamIdentifier}>
              Team #130 Blazing Spirits
            </Text>
            <View style={styles.teamOptions}>
              <TouchableOpacity style={styles.button} onPress={() => alert('Pressed!')}>
                <Text style={styles.buttonText}>Tap Me</Text>
                <MaterialCommunityIcons style={{padding:0, justifyContent: "center", alignItems:"center"}} name="information" size={20} color="#000000ff" onPress={() => router.back()} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.teamScores}>
            <View style={styles.teamStatus}>

            </View>
            <View style={styles.teamReliability}>

            </View>
          </View>
        </View>

        <View style={styles.statsInfo}>
          <Text style={styles.title}>
            Team Statistics
          </Text>
          <View>

          </View>
        </View>

        <View style={styles.reportsInfo}>
          <Text style={styles.title}>
            Match Reports
          </Text>
          <View>
            
          </View>
        </View>
      </ScrollView>
    </View>
  );

  
}
const styles = StyleSheet.create({
    main:{
      flex: 1,
      flexDirection:"column", 
      backgroundColor:"#FFF9F1",
    },
    navBar:{
      paddingTop:10,
      justifyContent: "center",
      paddingLeft: 25,
    },
    infoScroll:{
      width:width,
    },
    teamInfo:{
      alignItems: "center",
    },
    teamQuickInfo:{
      paddingBottom: 10,
      paddingTop: 10,
      width: width * 0.7,
      height: height * 0.575,
      alignItems:"center",
      justifyContent:"space-between",
      backgroundColor: "green"
    },
    teamImage:{
      width:width * 0.7,
      height:height * 0.45,
      backgroundColor:"#12c07dff"
    },
    teamIdentifier:{
      fontSize: 17.5
    },
    button:{
      height: height * 0.035,
      width: width * 0.15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 5,
      paddingLeft:5,
      paddingRight:5,
      backgroundColor: "red"
    },
    teamScores:{
      width: width * 0.8,
      height: height * 0.15,
      backgroundColor: "red",
    },
    statsInfo:{
      marginLeft: width * 0.1
    },
    reportsInfo:{
      marginLeft: width * 0.1
    }
  })