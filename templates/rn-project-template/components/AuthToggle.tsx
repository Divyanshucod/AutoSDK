import React from "react";
import { View, Button } from "react-native";

export default ({ mode, setMode }) => (
  <View style={{flexDirection:"row",marginVertical:10}}>
    <Button title="AccessToken" onPress={()=>setMode("token")} />
    <Button title="AppCreds" onPress={()=>setMode("app")} />
  </View>
);