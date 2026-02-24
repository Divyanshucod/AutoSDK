import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default ({ onLogs }) => (
  <View style={s.row}>
    <Text style={s.title}>HyperKYC Tester</Text>
    <TouchableOpacity onPress={onLogs}>
      <Text style={s.logs}>Logs</Text>
    </TouchableOpacity>
  </View>
);

const s = StyleSheet.create({
  row:{flexDirection:"row",justifyContent:"space-between"},
  title:{fontSize:20,fontWeight:"bold"},
  logs:{color:"blue"}
});