import React, {useEffect, useState} from "react";
import { Dimensions, Text, View, StyleSheet, Platform, Pressable, } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const router = useRouter();
type Team = {
  _id: number;
  team_number: number;
  team_name: string;
  profile_img_url: string;
  classified_amount_auto: number;
  can_collect_from_human_player: Boolean;
  can_deposit_close: Boolean;
  can_deposit_far: Boolean;
};

type TeamCardProps = {
  data: Team;
};


const { width, height } = Dimensions.get("screen");



const TeamCard: React.FC<TeamCardProps> = ({ data }) => {
  const collectionStyle = data.can_collect_from_human_player
  ? "Load & Go"
  : "Scavenger";

  const scoringStyle = data.can_deposit_close
  ? data.can_deposit_far
    ? "The Complete Package"
    : "Post Master"
  : data.can_deposit_far
    ? "Sharp Shooter"
    : "Defensive Demon";
    return(
    
    <View>
      <Pressable onPress={() =>router.navigate(`/(tabs)/reports/teamProfile?team_number=${data.team_number}`)}  style={styles.card}>
        <View style={styles.cardTopInfo}>
          <View style={styles.numberTag}>
            <Text style={styles.numberTagInfo}>
              #{data.team_number}
            </Text>
          </View>
          <Pressable>
            <MaterialCommunityIcons style={styles.playStyleImg} name="robot" size={30} color="#25292e" />
          </Pressable>
        </View>
        <View style={styles.cardBottomInfo}> 
          <View style={styles.statusButton}>

          </View>
          <View style={styles.stats}>
            <Text>
              {data.classified_amount_auto} artifacts in auto
            </Text>
            <Text>
              {collectionStyle} Scorer
            </Text>
            <Text>
              {scoringStyle}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card:{
    width: width * 0.4,
    height: height * 0.3,
    borderRadius: 15,
    marginTop: height * .025,
    marginLeft: width * .066,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#D9D9D9",
    borderWidth: 0,
  },
  cardTopInfo:{
    width: "100%",
    height: "20%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
  },
  numberTag:{
    height:"auto",
    borderRadius: 25,
    backgroundColor: "#ffc8aeff",
    alignItems:"center",
    justifyContent:"center",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop:5,
    paddingBottom:2.5,
  },
  playStyleImg:{
    
  },
  numberTagInfo:{
    color: "black",
    fontSize: 15,
  },
  cardBottomInfo:{
    width:"100%",
    height:"47.5%",
    flexDirection: "column",
    justifyContent: "space-between",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 10,
    
  },
  statusButton:{
    width:"30%",
    height:"55%",
    backgroundColor:"red",
    borderRadius: 5,
  },
  stats:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    
  },
});
const mobileStyles = StyleSheet.create({
  card:{
    width: width * 0.8,
    height: height * 0.3,
    borderWidth:5,
    borderColor: "orange",
    borderRadius: 15,
    marginTop: height * .025,
    marginLeft: width * .05,
    flexDirection: "column",
    justifyContent: "space-between"
  },
});

let cardType;
if(Platform.OS == "web"){
  cardType = styles.card;
}
else if(Platform.OS = "ios"){
  cardType = mobileStyles.card;
}

export default TeamCard;