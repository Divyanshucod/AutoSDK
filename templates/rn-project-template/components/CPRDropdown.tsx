import React from "react";
import { View, Text, Switch } from "react-native";

export default ({ value, onChange }) => (
  <View style={{marginVertical:10}}>
    <Text>With CPR</Text>
    <Switch value={value} onValueChange={onChange}/>
  </View>
);