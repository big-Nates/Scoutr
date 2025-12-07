import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { getToken, clearToken } from "@/app/api/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/verify/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          console.log("Is Authorized")
          setAuthorized(true);
        } else {
          await clearToken();
          console.log("Is not Authorized")
          router.replace("/(auth)/login");
        }
      } catch (err) {
        console.error(err);
        await clearToken();
        console.log("Is not Authorized")
        router.replace("/(auth)/login");
      }
    };
    checkAuth();
  }, []);

  // Show nothing (or a very small spinner) while checking auth
  if (authorized === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
