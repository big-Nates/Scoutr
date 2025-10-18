import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "@/app/api/client";
import { clearToken } from "@/app/api/auth";

const Account: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<{ first_name: string; last_name_initial: string;email: string } | null>(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/me"); // endpoint that returns current user info
      setAccount(response.data);
    } catch (error: any) {
      console.error("Error fetching account:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to fetch account details.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Clear token from storage
      // e.g., AsyncStorage.removeItem("jwtToken");
      clearToken()
      router.replace("/login"); // navigate back to login screen
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!account) {
    return (
      <View style={styles.container}>
        <Text>No account details found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Details</Text>
      <Text style={styles.label}>Name: {account.first_name} {account.last_name_initial}.</Text>
      <Text style={styles.label}>Email: {account.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
