import React, {useEffect, useState} from "react";
import { Dimensions, Text, View, StyleSheet, Platform, Button } from "react-native";
import { TouchableOpacity } from "react-native";

const { width, height } = Dimensions.get("screen");

type NumberSelectorProps = {
  value: number;
  onChange: (newValue: number) => void;
};

export default function DataFormRecorder({ value, onChange }: NumberSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => onChange(value - 1)} disabled={value === 0} >
        <Text style={{ fontSize: 2 }}>-</Text>
      </TouchableOpacity>

      <Text style={{ marginHorizontal: 10, fontSize: 20 }}>{value}</Text>

      <TouchableOpacity onPress={() => onChange(value + 1)} style={{ padding: 10 }}>
        <Text style={{ fontSize: 20 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container:{
        width: width * 0.55 * 0.25,
        height: height * 0.4 * 0.5 ,
        flexDirection: "row", 
        alignItems: "center",
        backgroundColor: "black",
    },
})

