import { Text, View } from "react-native";
import {StyleSheet} from "react-native";

export default function Account() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}>Home screen</Text>
    </View>
  );

  
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#FFF9F1",
    },
    text:{
      color: "#853232ff",
    }
  });