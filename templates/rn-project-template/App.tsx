import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { NativeModules } from "react-native";

import Header from "./components/Header";
import AuthToggle from "./components/AuthToggle";
import CPRDropdown from "./components/CPRDropdown";
import InputField from "./components/InputField";
import DynamicInputs from "./components/DynamicInputs";
import StartButton from "./components/StartButton";
import LoaderOverlay from "./components/LoaderOverlay";
import LogsModal from './components/LogsModal'

import { generateUUID } from "./utils/uuid";
import { validateConfig } from "./utils/validator";

const { Hyperkyc } = NativeModules;

export default function App() {
  const [mode, setMode] = useState("token");
  const [cpr, setCpr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  const [form, setForm] = useState({
    appId: "",
    appKey: "",
    accessToken: "",
    workflowId: "",
    transactionId: "",
    uniqueId: "",
  });

  const [autoGen, setAutoGen] = useState({
    transactionId: false,
    uniqueId: false,
  });

  const [dynamicFields, setDynamicFields] = useState([]);

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleAuto = key => {
    setAutoGen(prev => ({ ...prev, [key]: !prev[key] }));

    if (!autoGen[key])
      update(key, generateUUID());
  };

  const buildConfig = () => {
    let config = {
      workflowId: form.workflowId,
      transactionId: autoGen.transactionId
        ? generateUUID()
        : form.transactionId,
      ...(cpr && {
        uniqueId: autoGen.uniqueId
          ? generateUUID()
          : form.uniqueId
      }),
      ...Object.fromEntries(
        dynamicFields.map(f => [f.key, f.value])
      )
    };

    if (mode === "token")
      config.accessToken = form.accessToken;
    else {
      config.appId = form.appId;
      config.appKey = form.appKey;
    }

    return config;
  };

  const start = () => {
    const error = validateConfig({ form, mode, cpr });
    if (error) return Alert.alert("Validation", error);

    const config = buildConfig();
    setLogs(l => [...l, { type: "request", data: config }]);
    setLoading(true);

    Hyperkyc.launch(config, result => {
      setLogs(l => [...l, { type: "response", data: result }]);
      setLoading(false);

      switch (result?.response?.status) {
        case "auto_approved":
          Alert.alert("Approved");
          break;
        case "auto_declined":
          Alert.alert("Declined");
          break;
        case "needs_review":
          Alert.alert("Needs Review");
          break;
        case "user_cancelled":
          Alert.alert("Cancelled");
          break;
        default:
          Alert.alert("Error");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header onLogs={() => setLogsOpen(true)} />

      <AuthToggle mode={mode} setMode={setMode} />

      <CPRDropdown value={cpr} onChange={setCpr} />

      {mode === "app" && (
        <>
          <InputField label="App Id" value={form.appId} onChange={v => update("appId", v)} />
          <InputField label="App Key" value={form.appKey} onChange={v => update("appKey", v)} />
        </>
      )}

      {mode === "token" && (
        <InputField label="Access Token" value={form.accessToken} onChange={v => update("accessToken", v)} />
      )}

      <InputField label="Workflow Id" value={form.workflowId} onChange={v => update("workflowId", v)} />

      <InputField
        label="Transaction Id"
        value={form.transactionId}
        onChange={v => update("transactionId", v)}
        auto
        enabled={autoGen.transactionId}
        toggle={() => toggleAuto("transactionId")}
      />

      {cpr && (
        <InputField
          label="Unique Id"
          value={form.uniqueId}
          onChange={v => update("uniqueId", v)}
          auto
          enabled={autoGen.uniqueId}
          toggle={() => toggleAuto("uniqueId")}
        />
      )}

      <DynamicInputs fields={dynamicFields} setFields={setDynamicFields} />

      <View style={{ flex: 1 }} />

      <StartButton loading={loading} onPress={start} />

      <LoaderOverlay visible={loading} />

      <LogsModal visible={logsOpen} onClose={() => setLogsOpen(false)} logs={logs} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 }
});