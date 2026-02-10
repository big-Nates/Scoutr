import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3db8ffff',
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#F2F2F2',
          height: 50
         },
        tabBarPosition: "bottom",
        
      }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'document' : 'document-outline'} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Statstics',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'bar-chart-sharp' : 'bar-chart-outline'} color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'medal-sharp' : 'medal-outline'} color={color} size={24} />,
        }}
      />
      
      
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
