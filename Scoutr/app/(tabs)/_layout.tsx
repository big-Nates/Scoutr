import { Tabs } from 'expo-router';
import Ioniccons from "@expo/vector-icons/Ionicons"
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#FFF9F1',
        },
        headerShadowVisible: false,
        headerTintColor: '#000000ff',
        tabBarStyle: {
          backgroundColor: '#FFF9F1',
        },
        }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}/>
      <Tabs.Screen name="about" 
        options={{ 
          title: 'About', 
          tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
            ),
        }}/>
    </Tabs>
    
  );
}