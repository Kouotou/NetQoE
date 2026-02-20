import { View, Text, StyleSheet, StatusBar, Alert } from 'react-native';
import { TextInput, Button, Checkbox } from 'react-native-paper';
import{ signupScreenStyles as styles} from '@/styles'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { apiService, RegisterRequest } from '../services/api';
import { AuthStorage } from '../services/authStorage';

export default function Signup() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !university || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!checked) {
      Alert.alert('Error', 'Please accept the Terms of Service');
      return;
    }

    setLoading(true);
    try {
      const userData: RegisterRequest = {
        email,
        password,
        full_name: fullName,
        university
      };
      
      const response = await apiService.register(userData);
      
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.push('/login') }
      ]);
    } catch (error) {
      Alert.alert('Registration Failed', error instanceof Error ? error.message : 'An error occurred');
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
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Email / Student ID</Text>
          <TextInput
            mode="outlined"
            placeholder="engineer@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Organization/University Name</Text>
          <TextInput
            mode="outlined"
            placeholder="University or Company"
            value={university}
            onChangeText={setUniversity}
            style={styles.input}
            outlineStyle={styles.inputOutline}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            mode="outlined"
            placeholder="Create a secure password"
            value={password}
            onChangeText={setPassword}
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
            disabled={!checked || loading}
            onPress={handleSignup}
            loading={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>

        </View>
      </View>
    </View>
  );
}
