import { Stack } from 'expo-router';

export default function ReportsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="reports"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="teamProfile"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}