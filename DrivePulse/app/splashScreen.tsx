import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { splashScreenStyles } from '@/styles';

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={splashScreenStyles.wrapper}>
      <StatusBar barStyle="light-content" />

      <View style={splashScreenStyles.container}>
        {/* Logo */}
        <View style={splashScreenStyles.logoContainer}>
          <Text style={{ fontSize: 24 }}>📍</Text>
        </View>

        {/* Title */}
        <Text style={splashScreenStyles.title}>DrivePulse</Text>

        {/* Subtitle */}
        <Text style={splashScreenStyles.subtitle}>
          Real-Time Network Insights
        </Text>

        <View style={{ flex: 1 }} />

        {/* Get Started Button */}
        <Button
          mode="contained"
          onPress={() => router.push('/signup')}
          contentStyle={splashScreenStyles.buttonContent}
          style={splashScreenStyles.button}
          labelStyle={splashScreenStyles.buttonLabel}
        >
          Get Started
        </Button>

        {/* Login Text */}
        <Text
          style={splashScreenStyles.loginText}
          onPress={() => router.push('/login')}
        >
          I already have an account
        </Text>
      </View>
    </View>
  );
}
