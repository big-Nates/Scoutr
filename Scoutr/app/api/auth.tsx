import * as SecureStore from "expo-secure-store";

/**
 * Save JWT token securely
 */
export async function saveToken(token: string) {
  try {
    await SecureStore.setItemAsync("jwt_token", token);
  } catch (e) {
    console.error("Error saving token:", e);
  }
}

/**
 * Retrieve JWT token
 */
export async function getToken() {
  try {
    return await SecureStore.getItemAsync("jwt_token");
  } catch (e) {
    console.error("Error reading token:", e);
    return null;
  }
}

/**
 * Delete token (logout)
 */
export async function clearToken() {
  try {
    await SecureStore.deleteItemAsync("jwt_token");
  } catch (e) {
    console.error("Error clearing token:", e);
  }
}
