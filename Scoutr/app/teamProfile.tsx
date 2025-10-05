import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TeamProfile() {
  const router = useRouter();

  return (
    <View style={styles.main}>
      <MaterialCommunityIcons name="chevron-left" size={30} color="#25292e" onPress={() => router.back()} />
      <Text style={{ fontSize: 20 }}>Team Profile</Text>
      
    </View>
  );

  
}
const styles = StyleSheet.create({
    main:{
      flex: 1,
      paddingLeft:0,  
      paddingRight:0,  
      backgroundColor:"#FFF9F1"
    }
  })