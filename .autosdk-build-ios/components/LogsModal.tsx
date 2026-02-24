import React from "react";
import { Modal, View, Text, ScrollView, Button } from "react-native";

export default ({ visible, onClose, logs }) => (
  <Modal visible={visible}>
    <View style={{flex:1,padding:20}}>
      <Button title="Close" onPress={onClose}/>
      <ScrollView>
        {logs.map((l,i)=>(
          <Text key={i}>
            {l.type.toUpperCase()}:
            {"\n"}
            {JSON.stringify(l.data,null,2)}
            {"\n\n"}
          </Text>
        ))}
      </ScrollView>
    </View>
  </Modal>
);