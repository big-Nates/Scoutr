import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Slot, SplashScreen } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import api from "./api/client";
import {saveToken, getToken, clearToken} from "./api/auth"





export default function TabLayout() {
  return (
    <Stack>
      {/* Tabs navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(auth)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(landing)"
        options={{ headerShown: false }}
      />
    </Stack>
    
  );
}
