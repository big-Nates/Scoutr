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
      <Tabs.Screen 
        name="events" 
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'medal-outline' : 'medal-outline'} color={color} size={24} />
          ),
        }}/>
      <Tabs.Screen 
        name="create" 
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={24} />
          ),
        }}/> 
      <Tabs.Screen 
        name="reports" 
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document' : 'document-outline'} color={color} size={24} />
          ),
        }}/> 
      <Tabs.Screen name="account" 
        options={{ 
          title: 'Account', 
          tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
            ),
        }}/>
    </Tabs>
    
  );
}