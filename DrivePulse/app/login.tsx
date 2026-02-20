import { View, Text, StyleSheet, StatusBar, Alert } from "react-native";
import { TextInput, Button, Switch } from "react-native-paper";
import { loginScreenStyles as styles } from "@/styles";
import { useRouter } from "expo-router";
import { useState } from "react";
import { apiService, LoginRequest } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginRequest = { email, password };
      const response = await apiService.login(credentials);
      
      await login(response.access_token);
      
      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => router.push("/(tabs)") }
      ]);
    } catch (error) {
      Alert.alert("Login Failed", error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" />

      {/* Back Button */}
      <Text style={styles.backText} onPress={() => router.back()}>
        ← Back
      </Text>

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={{ fontSize: 20 }}>📍</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue monitoring</Text>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Email / ID</Text>
          <TextInput
            mode="outlined"
            placeholder="your.email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            mode="outlined"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {/* Remember Device */}
          <View style={styles.switchContainer}>
            <Text style={styles.rememberText}>Remember this device</Text>
            <Switch
              value={remember}
              onValueChange={() => setRemember(!remember)}
            />
          </View>

          {/* Enter Dashboard Button */}
          <Button
            mode="contained"
            style={styles.loginButton}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={styles.loginButtonLabel}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Enter Dashboard"}
          </Button>

          {/* Forgot Password */}
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </View>
      </View>
    </View>
  );
}
