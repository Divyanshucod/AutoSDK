import React from "react";
import { Modal, View, Text, ActivityIndicator } from "react-native";

export default ({ visible }) => (
  <Modal transparent visible={visible}>
    <View style={{
      flex:1,
      backgroundColor:"#0008",
      justifyContent:"center",
      alignItems:"center"
    }}>
      <ActivityIndicator size="large" color="white"/>
      <Text style={{color:"white",marginTop:10}}>
        Processing verification…
      </Text>
    </View>
  </Modal>
);