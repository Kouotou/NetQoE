import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import{ signupScreenStyles as styles} from '@/styles'
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Signup() {
  const router = useRouter();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);

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
        <Text style={styles.title}>Create Tester Profile</Text>
        <Text style={styles.subtitle}>
          Join the network monitoring community
        </Text>

        {/* Form */}
        <View style={styles.form}>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            mode="outlined"
            placeholder="Field Engineer Name"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Email / Student ID</Text>
          <TextInput
            mode="outlined"
            placeholder="engineer@example.com"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Organization/University Name</Text>
          <TextInput
            mode="outlined"
            placeholder="University or Company"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            mode="outlined"
            placeholder="Create a secure password"
            secureTextEntry={!passwordVisible}
            style={styles.input}
            outlineStyle={styles.inputOutline}
            right={
              <TextInput.Icon
                icon={passwordVisible ? 'eye-off' : 'eye'}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
          />

          {/* Checkbox */}
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checked ? 'checked' : 'unchecked'}
              onPress={() => setChecked(!checked)}
            />
            <Text style={styles.checkboxText}>
              I accept the Terms of Service & Data logging Policy
            </Text>
          </View>

          {/* Create Account Button */}
          <Button
            mode="contained"
            style={styles.createButton}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={styles.createButtonLabel}
            disabled={!checked}
            onPress={() => router.push("/(tabs)")}
          >
            Create Account
          </Button>

        </View>
      </View>
    </View>
  );
}
