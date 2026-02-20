import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar,
  Alert 
} from 'react-native';
import { 
  Battery, 
  Satellite, 
  Activity, 
  Map as MapIcon, 
  Zap, 
  FileText, 
  Settings,
  ArrowDown,
  ArrowUp
} from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { speedScreenStyles as styles } from "@/styles";
import { COLORS } from '@/styles/speedScreen.styles';
import { speedTestService, SpeedTestResult, SpeedTestProgress } from '../../services/speedTestService';
import { useNetwork } from '../../contexts/NetworkContext';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { useRouter } from 'expo-router';


// --- Sub-Components ---

// 1. Central Progress Gauge
const ProgressGauge = ({ progress, phase }: { progress: number; phase: string }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <View style={styles.readyContainer}>
      <Svg width="240" height="240" viewBox="0 0 100 100">
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke="#E2E8F0"
          strokeWidth="2"
          fill="none"
        />
        <Circle
          cx="50"
          cy="50"
          r="45"
          stroke={COLORS.primary}
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </Svg>
      <View style={styles.readyTextWrapper}>
        <Text style={styles.readyTitle}>{progress}%</Text>
        <Text style={styles.readySubtitle}>{phase}</Text>
      </View>
    </View>
  );
};

// 2. Metric Speed Card (Download/Upload)
const SpeedCard = ({ type, value }: { type: 'Downlink' | 'Uplink', value: string }) => (
  <View style={styles.speedCard}>
    <View style={styles.speedHeader}>
      {type === 'Downlink' ? (
        <ArrowDown size={18} color={COLORS.success} />
      ) : (
        <ArrowUp size={18} color={COLORS.primary} />
      )}
      <Text style={styles.speedLabel}>{type}</Text>
    </View>
    <Text style={styles.speedValue}>{value}</Text>
    <Text style={styles.speedUnit}>Mbps</Text>
  </View>
);

// 3. Bottom Nav Item (Reused)
const NavItem = ({ icon: Icon, label, active }: any) => (
  <TouchableOpacity style={styles.navItem}>
    <Icon 
      size={24} 
      color={active ? COLORS.primary : '#A0AEC0'} 
      strokeWidth={active ? 2.5 : 2} 
    />
    <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
  </TouchableOpacity>
);

export default function SpeedScreen() {
  const { selectedNetwork } = useNetwork();
  const { logout } = useAuth();
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ phase: 'idle', progress: 0 });
  const [results, setResults] = useState<SpeedTestResult | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState(0);

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
            speedTestService.stopTest();
            await logout();
            router.replace('/splashScreen');
          }
        }
      ]
    );
  };

  const runSpeedTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setResults(null);
    setCurrentSpeed(0);
    
    try {
      const result = await speedTestService.runSpeedTest(
        selectedNetwork,
        (progressData: SpeedTestProgress) => {
          setProgress({
            phase: progressData.phase,
            progress: progressData.progress
          });
          if (progressData.currentSpeed) {
            setCurrentSpeed(progressData.currentSpeed);
          }
        }
      );
      
      setResults(result);
      
      // Upload to backend
      try {
        await apiService.uploadSpeedTest(result);
      } catch (error) {
        console.error('Failed to upload speed test:', error);
      }
      
    } catch (error) {
      Alert.alert('Error', 'Speed test failed. Please try again.');
    } finally {
      setIsRunning(false);
      setProgress({ phase: 'idle', progress: 0 });
    }
  };

  const getPhaseText = () => {
    switch (progress.phase) {
      case 'ping': return 'Testing Ping...';
      case 'downlink': return 'Testing Downlink...';
      case 'Uplink': return 'Testing Uplink...';
      case 'complete': return 'Complete!';
      default: return 'Ready';
    }
  };

  const getButtonText = () => {
    if (isRunning) return 'TESTING...';
    if (results) return 'RUN AGAIN';
    return 'RUN TEST';
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <MapIcon size={16} color="#FFF" />
          </View>
          <Text style={styles.headerTitle}>DrivePulse</Text>
        </View>
        <View style={styles.headerStatus}>
          <Battery size={20} color={COLORS.success} fill={COLORS.success} />
          <Text style={styles.batteryText}>85%</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Satellite size={20} color={COLORS.primary} style={{marginLeft: 12}} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        {/* Network Indicator */}
        <View style={styles.networkIndicator}>
          <Text style={styles.networkText}>Testing on {selectedNetwork}</Text>
        </View>

        {/* Progress Circle Section */}
        <ProgressGauge 
          progress={progress.progress} 
          phase={getPhaseText()}
        />

        {/* Speed Cards Row */}
        <View style={styles.speedRow}>
          <SpeedCard 
            type="Downlink" 
            value={results ? results.downloadMbps.toString() : (progress.phase === 'downlink' ? currentSpeed.toFixed(1) : '0.0')} 
          />
          <SpeedCard 
            type="Uplink" 
            value={results ? results.uploadMbps.toString() : (progress.phase === 'uplink' ? currentSpeed.toFixed(1) : '0.0')} 
          />
        </View>

        {/* Ping and Jitter Section */}
        <View style={styles.latencyCard}>
          <View style={styles.latencyItem}>
            <Text style={styles.latencyLabel}>Ping</Text>
            <Text style={styles.latencyValue}>{results ? results.pingMs : 0} ms</Text>
          </View>
          <View style={styles.latencyDivider} />
          <View style={styles.latencyItem}>
            <Text style={styles.latencyLabel}>Jitter</Text>
            <Text style={styles.latencyValue}>{results ? results.jitterMs : 0} ms</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity 
          style={[styles.runTestButton, isRunning && styles.runTestButtonDisabled]} 
          activeOpacity={0.8}
          onPress={runSpeedTest}
          disabled={isRunning}
        >
          <Text style={styles.runTestText}>{getButtonText()}</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}