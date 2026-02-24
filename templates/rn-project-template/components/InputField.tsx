import React from "react";
import { View, Text, TextInput, Button } from "react-native";

export default ({ label, value, onChange, auto, enabled, toggle }) => (
  <View style={{marginVertical:6}}>
    <Text>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={{borderWidth:1,padding:8,borderRadius:6}}
      editable={!enabled}
    />
    {auto && (
      <Button
        title={enabled ? "Auto ✓" : "Generate Automatically"}
        onPress={toggle}
      />
    )}
  </View>
);