import React from "react";
import { FlatList, View, Text, StyleSheet, Dimensions } from "react-native";

export default function App() {
  const data = Array.from({ length: 20 }).map((_, i) => ({ id: i, title: `Item ${i + 1}` }));

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.text}>{item.title}</Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}


const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: "#fdbf9bff",
  },
  item: {
    width: width * 0.9,   // 90% of screen width
    height: height * 0.1, // 10% of screen height
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
  },
});



