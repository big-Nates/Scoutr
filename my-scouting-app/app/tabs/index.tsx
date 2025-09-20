import { Text, View, StyleSheet,  } from "react-native";
import { Link} from "expo-router";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style = {styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Link href = {"/tabs/about"} style = {styles.button}>About</Link>
    </View>

    
    
  );
    
}
const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#3783e0ff',
        alignItems: 'center',
       justifyContent: 'center',
      },
      text: {
        color: '#ee7676ff',
      },
      button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#00ff15ff"
      }
    });
