import React, {useState, useEffect} from "react";
import { FlatList, View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, TextInput } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TeamCard from "@/components/TeamReportIcon";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("screen");
  

// Sample team data
const teams = [
  { number: 130, status: "Maintenance", name: "Blazing Spirits" },
  { number: 16008, status: "Major Error", name: "Armored Artimesis" },
  { number: 13000, status: "Major Error", name: "Data Wolves" },
  { number: 1, status: "Major Error", name: "Team Unlimited" },
  { number: 40, status: "Major Error", name: "HAX robotics" },
];


export default function Reports() {
  const [data, setData] = useState(teams);
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (query === '') {
      setData(teams);
    } else {
      
      const filtered = teams.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setData(filtered);
    }
  }, [query]);
  return(
    <View style={styles.main}>
      <View style={styles.filterBar}>
        <View style={styles.filters}>
          <Text style={styles.filterBarLeft}>
          Team Reports
          </Text>
          <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
        </View>
        

        <View style={styles.filterBarRight}>
          <View style={styles.filters}>
            <Text>
              Rating
            </Text>
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
              onChangeText={text => setQuery(text)}
            />
          </View>
        </View>

      </View>
      <FlatList
            data={data}
            renderItem={({ item }) => (
              
              <TeamCard data={item}></TeamCard>
            )}
            contentContainerStyle={{ flexGrow: 1,justifyContent: 'center',alignItems: 'center',paddingBottom: 50 }}
            keyExtractor={(item) => item.number.toString()}
            numColumns={cards}
          />
      
    </View>
    
  );
}
let cards = 1;
if(Platform.OS == "web"){
  cards=2;
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingLeft:0,  
    paddingRight:0,  
    backgroundColor:"#FFF9F1"
  },
  filterBar: {
    height:"10%",
    backgroundColor: "#FFF9F1",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: width * .066,
    paddingRight: width * .066,
    alignItems:"center",
  },
  filterBarRight: {
    flexDirection: "row",
    justifyContent: "space-between",
    width:width*0.3,
    
  },
  filterBarLeft: {
    fontSize:20,
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center"
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

});