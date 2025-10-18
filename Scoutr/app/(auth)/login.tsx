import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppAlert from "@/components/AppAlert";
import { saveToken } from "@/app/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const showAlert = (title: string, message: any) => {
    const msg =
      typeof message === "string" ? message : JSON.stringify(message, null, 2);
    setAlertTitle(title);
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Missing fields", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      // Use FormData for FastAPI form login
      const formData = new FormData();
      formData.append("username", email); // OAuth2PasswordRequestForm expects "username"
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/login/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        let errorMsg = "Invalid email or password.";

        if (data.detail) {
          if (Array.isArray(data.detail)) {
            errorMsg = data.detail
              .map((err: any) => err.msg || JSON.stringify(err))
              .join("\n");
          } else if (typeof data.detail === "string") {
            errorMsg = data.detail;
          } else if (typeof data.detail === "object") {
            errorMsg = JSON.stringify(data.detail);
          }
        }

        showAlert("Login failed", errorMsg);
        setLoading(false);
        return;
      }

      // Successful login
      if (data.access_token && data.token_type === "bearer") {
        await saveToken(data.access_token);
        showAlert("Success", "Login successful!");

        setTimeout(() => {
          setAlertVisible(false);
          router.replace("/(tabs)/reports");
          setLoading(false);
        }, 1200);
      } else {
        showAlert("Error", "Invalid response from server.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      showAlert("Error", "Could not connect to the server. Try again later.");
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.navBar}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={40}
          color="#000"
          onPress={() => router.navigate("/")}
        />
      </View>

      <Text style={styles.title}>Welcome Back</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don’t have an account?{" "}
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/register")}
        >
          Sign up
        </Text>
      </Text>

      <AppAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  navBar: {
    paddingTop: 10,
    width: "100%",
    justifyContent: "center",
    paddingLeft: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#222",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    color: "#666",
  },
  link: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
