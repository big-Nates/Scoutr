import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';




// // "http://192.168.68.52:8000/match_reports/2024/USCTCMP"
export default function TabLayout() {
  return (
    <Stack>
      {/* Tabs navigator */}
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Stack>
    
  );
}
