import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* Tabs navigator */}
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Hidden screens */}
      <Stack.Screen
        name="teamProfile"
        options={{ headerShown: false }} // optional, hide header
      />
    </Stack>
  );
}
