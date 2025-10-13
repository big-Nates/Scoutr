import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function ReportsScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Sign Up Page</Text>
    </View>
  );
}