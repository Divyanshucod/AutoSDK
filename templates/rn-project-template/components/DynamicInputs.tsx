import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Modal,
  Text,
  Alert
} from "react-native";

export default function DynamicInputs({ fields, setFields }) {
  const [jsonModal, setJsonModal] = useState(false);
  const [jsonText, setJsonText] = useState("");

  const add = () => setFields([...fields, { key: "", value: "" }]);

  const remove = i =>
    setFields(fields.filter((_, x) => x !== i));

  const update = (i, k, v) => {
    const copy = [...fields];
    copy[i][k] = v;
    setFields(copy);
  };

  const pasteJSON = () => {
    try {
      const obj = JSON.parse(jsonText);

      const parsed = Object.entries(obj).map(([k, v]) => ({
        key: k,
        value: String(v),
      }));

      setFields(parsed);
      setJsonText("");
      setJsonModal(false);
    } catch (e) {
      Alert.alert("Invalid JSON");
    }
  };

  return (
    <View>

      {/* Existing dynamic rows */}
      {fields.map((f, i) => (
        <View key={i} style={{ flexDirection: "row", marginVertical: 5 }}>
          <TextInput
            placeholder="key"
            value={f.key}
            onChangeText={v => update(i, "key", v)}
            style={{ flex: 1, borderWidth: 1 }}
          />
          <TextInput
            placeholder="value"
            value={f.value}
            onChangeText={v => update(i, "value", v)}
            style={{ flex: 1, borderWidth: 1 }}
          />
          <Button title="X" onPress={() => remove(i)} />
        </View>
      ))}

      <Button title="Add Field" onPress={add} />
      <Button title="Paste JSON" onPress={() => setJsonModal(true)} />

      {/* JSON Modal */}
      <Modal visible={jsonModal} animationType="slide">
        <View style={{ flex: 1, padding: 20 }}>
          <Text>Paste JSON</Text>
          <TextInput
            multiline
            value={jsonText}
            onChangeText={setJsonText}
            style={{
              borderWidth: 1,
              height: 200,
              marginVertical: 20,
              textAlignVertical: "top",
            }}
          />
          <Button title="Parse & Apply" onPress={pasteJSON} />
          <Button title="Cancel" onPress={() => setJsonModal(false)} />
        </View>
      </Modal>
    </View>
  );
}