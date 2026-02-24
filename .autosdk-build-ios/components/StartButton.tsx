import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

export default ({ loading, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    style={{
      alignSelf:"center",
      padding:15,
      backgroundColor:"black",
      borderRadius:10,
      marginBottom:20
    }}>
    {loading
      ? <ActivityIndicator color="white"/>
      : <Text style={{color:"white"}}>Start</Text>}
  </TouchableOpacity>
);