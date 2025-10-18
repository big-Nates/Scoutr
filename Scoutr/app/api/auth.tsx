import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function saveToken(token: string) {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem("jwt_token", token);
    } else {
      await SecureStore.setItemAsync("jwt_token", token);
    }
  } catch (e) {
    console.error("Error saving token:", e);
  }
}

export async function getToken() {
  try {
    console.log("Authorizing")
    if (Platform.OS === "web") {
      return localStorage.getItem("jwt_token");
    } else {
      return await SecureStore.getItemAsync("jwt_token");
    }
  } catch (e) {
    console.error("Error reading token:", e);
    return null;
  }
}

export async function clearToken() {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem("jwt_token");
    } else {
      await SecureStore.deleteItemAsync("jwt_token");
    }
  } catch (e) {
    console.error("Error clearing token:", e);
  }
}
