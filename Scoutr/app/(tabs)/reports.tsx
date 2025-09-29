import React from "react";
import { FlatList, View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from "react-native";
import TeamCard from "@/components/TeamReportIcon";


  

// Sample team data
const teams = [
  { number: 130, status: "Maintenance", name: "Blazing Spirits" },
  { number: 16008, status: "Major Error", name: "Armored Artimesis" },
  { number: 13000, status: "Major Error", name: "Data Wolves" },
  { number: 1, status: "Major Error", name: "Team Unlimited" },
];

export default function Reports() {
  return(
    <View style={styles.main}>
      <View style={styles.filterBar}>

      </View>
      <FlatList
            data={teams}
            renderItem={({ item }) => (
              
              <TeamCard data={item}></TeamCard>
            )}
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
  },
  filterBar: {
    height:"10%",
    backgroundColor: "#ffc8aeff",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 5,
    paddingRight: 5,
  },
});




