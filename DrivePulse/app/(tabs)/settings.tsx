import React, { useState, useEffect } from 'react'
import { View, ScrollView, Alert, Platform } from 'react-native'
import {
  Text,
  Switch,
  Card,
  Divider,
  List,
  Button
} from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { settingScreenStyles as styles } from "@/styles";
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { apiService } from '../../services/api';
import { AuthStorage } from '../../services/authStorage';
import { useRouter } from 'expo-router';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { selectedNetwork } = useNetwork();
  const router = useRouter();
  
  // Settings state
  const [rssi, setRssi] = useState(true)
  const [rsrp, setRsrp] = useState(true)
  const [sinr, setSinr] = useState(true)
  const [qos, setQos] = useState(false)
  const [frequency, setFrequency] = useState(false)
  const [logFrequency, setLogFrequency] = useState(5)
  
  // Device info state
  const [deviceInfo, setDeviceInfo] = useState({
    model: 'Loading...',
    osVersion: 'Loading...',
    appVersion: 'Loading...'
  });
  
  // Statistics state
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalDistance: 0,
    totalEvents: 0,
    avgSignal: 0
  });

  useEffect(() => {
    loadSettings();
    loadDeviceInfo();
    loadUserStats();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('app_settings');
      if (settings) {
        const parsed = JSON.parse(settings);
        setRssi(parsed.rssi ?? true);
        setRsrp(parsed.rsrp ?? true);
        setSinr(parsed.sinr ?? true);
        setQos(parsed.qos ?? false);
        setFrequency(parsed.frequency ?? false);
        setLogFrequency(parsed.logFrequency ?? 5);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        rssi,
        rsrp,
        sinr,
        qos,
        frequency,
        logFrequency
      };
      await AsyncStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const loadDeviceInfo = async () => {
    try {
      const model = Device.modelName || Device.deviceName || 'Unknown Device';
      const osVersion = `${Platform.OS} ${Device.osVersion || 'Unknown'}`;
      const appVersion = Application.nativeApplicationVersion || '1.0.0';
      
      setDeviceInfo({
        model,
        osVersion,
        appVersion
      });
    } catch (error) {
      console.error('Failed to load device info:', error);
    }
  };

  const loadUserStats = async () => {
    try {
      const token = await AuthStorage.getToken();
      if (token) {
        apiService.setToken(token);
        const sessions = await apiService.getUserSessions();
        
        const totalSessions = sessions.length;
        const totalDistance = sessions.reduce((sum, s) => sum + (s.total_distance_km || 0), 0);
        const totalEvents = sessions.reduce((sum, s) => 
          sum + (s.drops_count || 0) + (s.handovers_count || 0) + (s.speedtest_count || 0), 0
        );
        const avgSignal = sessions.length > 0 ? 
          sessions.reduce((sum, s) => sum + (s.avg_rssi || 0), 0) / sessions.length : 0;
        
        setStats({
          totalSessions,
          totalDistance: Math.round(totalDistance * 100) / 100,
          totalEvents,
          avgSignal: Math.round(avgSignal)
        });
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  // Auto-save settings when they change
  useEffect(() => {
    saveSettings();
  }, [rssi, rsrp, sinr, qos, frequency, logFrequency]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/splashScreen');
          }
        }
      ]
    );
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Clear All Logs',
      'This will delete all session data and logs. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear local storage
              await AsyncStorage.clear();
              // Reload stats
              setStats({ totalSessions: 0, totalDistance: 0, totalEvents: 0, avgSignal: 0 });
              Alert.alert('Success', 'All logs cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear logs');
            }
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      `Export ${stats.totalSessions} sessions with ${stats.totalEvents} events?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            // Export functionality would be implemented here
            Alert.alert('Info', 'Export functionality will be available in a future update');
          }
        }
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset Application',
      'This will reset all settings and clear all data. You will be logged out.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await logout();
              router.replace('/splashScreen');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset application');
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* PROFILE SECTION */}
      <Card style={styles.card}>
        <Card.Title title="Profile" subtitle={`DrivePulse User - ${selectedNetwork} Network`} />
        <Card.Content>
          <Text>Email: {user?.email || 'Not logged in'}</Text>
          <Text>Name: {user?.full_name || 'N/A'}</Text>
          <Text>University: {user?.university || 'N/A'}</Text>
        </Card.Content>
      </Card>

      {/* USER STATISTICS */}
      <Card style={styles.card}>
        <Card.Title title="Usage Statistics" />
        <Card.Content>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDistance} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalEvents}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.avgSignal} dBm</Text>
              <Text style={styles.statLabel}>Avg Signal</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* METRICS TOGGLE SECTION */}
      <Card style={styles.card}>
        <Card.Title title="Metrics Configuration" />
        <Card.Content>

          <List.Item
            title="RSSI"
            right={() => (
              <Switch value={rssi} onValueChange={setRssi} />
            )}
          />

          <List.Item
            title="RSRP / RSRQ"
            right={() => (
              <Switch value={rsrp} onValueChange={setRsrp} />
            )}
          />

          <List.Item
            title="SINR"
            right={() => (
              <Switch value={sinr} onValueChange={setSinr} />
            )}
          />

          <List.Item
            title="QoS"
            right={() => (
              <Switch value={qos} onValueChange={setQos} />
            )}
          />

          <List.Item
            title="Frequency Info"
            right={() => (
              <Switch value={frequency} onValueChange={setFrequency} />
            )}
          />

        </Card.Content>
      </Card>

      {/* LOG FREQUENCY SLIDER */}
      <Card style={styles.card}>
        <Card.Title title="Log Frequency" />
        <Card.Content>
          <Text style={styles.sliderValue}>
            {logFrequency} seconds
          </Text>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={logFrequency}
            onValueChange={setLogFrequency}
          />

          <Text style={styles.helperText}>
            Adjust how often logs are recorded.
          </Text>
        </Card.Content>
      </Card>

      {/* DEVICE INFORMATION */}
      <Card style={styles.card}>
        <Card.Title title="Device Information" />
        <Card.Content>
          <Text>Model: {deviceInfo.model}</Text>
          <Text>OS Version: {deviceInfo.osVersion}</Text>
          <Text>App Version: {deviceInfo.appVersion}</Text>
          <Text>Platform: {Platform.OS}</Text>
        </Card.Content>
      </Card>

      {/* SYSTEM MANAGEMENT */}
      <Card style={styles.card}>
        <Card.Title title="System Management" />
        <Card.Content>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={handleClearLogs}
          >
            Clear All Logs
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={handleExportData}
          >
            Export All Data
          </Button>

          <Button
            mode="contained"
            style={styles.dangerButton}
            onPress={handleResetApp}
          >
            Reset Application
          </Button>

          <Button
            mode="contained"
            style={[styles.dangerButton, { marginTop: 10 }]}
            onPress={handleLogout}
          >
            Logout
          </Button>

        </Card.Content>
      </Card>

      <View style={{ height: 40 }} />

    </ScrollView>
  )
}
