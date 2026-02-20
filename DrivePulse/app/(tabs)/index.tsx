import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { dashboardScreenStyles as styles } from "@/styles";
import { networkService, NetworkData } from "../../services/networkService";
import { apiService, SessionResponse, MosFeedbackData } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useNetwork } from "../../contexts/NetworkContext";
import { AuthStorage } from "../../services/authStorage";
import { useRouter } from "expo-router";

const Gauge = ({ rssi, quality }: { rssi: number; quality: string }) => {
  const radius = 100;
  const strokeWidth = 14;
  const center = 120;

  // Calculate arc position based on RSSI (-120 to -30 dBm range)
  const normalizedRssi = Math.max(-120, Math.min(-30, rssi));
  const percentage = (normalizedRssi + 120) / 90; // 0 to 1
  const arcEndAngle = Math.PI + (Math.PI * percentage);

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number
  ) => {
    const start = {
      x: x + radius * Math.cos(startAngle),
      y: y + radius * Math.sin(startAngle),
    };
    const end = {
      x: x + radius * Math.cos(endAngle),
      y: y + radius * Math.sin(endAngle),
    };

    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  };

  // Color based on quality
  const getColor = () => {
    switch (quality) {
      case 'Excellent': return '#4CAF50';
      case 'Good': return '#1565C0';
      case 'Fair': return '#FF9800';
      case 'Poor': return '#F44336';
      default: return '#1565C0';
    }
  };

  return (
    <View style={styles.gaugeContainer}>
      <Svg width={240} height={150}>
        {/* background arc */}
        <Path
          d={describeArc(center, 120, radius, Math.PI, Math.PI * 2)}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        {/* active arc */}
        <Path
          d={describeArc(center, 120, radius, Math.PI, arcEndAngle)}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.gaugeText}>
        <Text style={styles.signalValue}>{rssi}</Text>
        <Text style={styles.unit}>dBm</Text>
        <Text style={[styles.good, { color: getColor() }]}>{quality}</Text>
      </View>
    </View>
  );
};

const QoEComponent = ({ onRatingSubmit }: { onRatingSubmit: (rating: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleRatingSelect = (rating: number) => {
    setSelected(rating);
    onRatingSubmit(rating);
  };

  return (
    <View style={styles.qoeCard}>
      <Text style={styles.qoeTitle}>QoE Rating</Text>
      <Text style={styles.qoeSubtitle}>Rate your Quality of Experience</Text>

      <View style={styles.qoeRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.qoeButton, selected === num && styles.qoeSelected]}
            onPress={() => handleRatingSelect(num)}
          >
            <Text
              style={[styles.qoeText, selected === num && styles.qoeTextSelected]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const { selectedNetwork, setSelectedNetwork } = useNetwork();
  const router = useRouter();
  const [network, setNetwork] = useState(selectedNetwork);
  const [networkData, setNetworkData] = useState<NetworkData>({
    rssi: -81,
    rsrp: -95,
    sinr: 15,
    cellId: '0x1A2B3C',
    frequency: 2600,
    bandwidth: 20,
    pci: 156,
    quality: 'Good'
  });
  const [currentSession, setCurrentSession] = useState<SessionResponse | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      initializeSession();
    }
    return () => {
      networkService.stopMeasurements();
    };
  }, [isAuthenticated]);

  const initializeSession = async () => {
    // Ensure API service has the token
    const token = await AuthStorage.getToken();
    if (token) {
      apiService.setToken(token);
      startDriveTest();
    }
  };

  const startDriveTest = async () => {
    try {
      console.log('Starting drive test session...');
      const session = await apiService.startSession();
      console.log('Session started:', session);
      setCurrentSession(session);
      setIsSessionActive(true);
      
      // Start network measurements
      networkService.startMeasurements(network, (data) => {
        setNetworkData(data);
        uploadMeasurement(data);
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      Alert.alert('Error', 'Failed to start drive test session');
    }
  };

  const uploadMeasurement = async (data: NetworkData) => {
    if (!currentSession) return;
    
    try {
      const measurementData = networkService.toMeasurementData(data, network);
      await apiService.uploadMeasurement(currentSession.id, measurementData);
    } catch (error) {
      console.error('Failed to upload measurement:', error);
    }
  };

  const handleNetworkChange = (newNetwork: string) => {
    setNetwork(newNetwork);
    setSelectedNetwork(newNetwork);
    if (isSessionActive) {
      networkService.updateTechnology(newNetwork, (data) => {
        setNetworkData(data);
        uploadMeasurement(data);
      });
    }
  };

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
            networkService.stopMeasurements();
            await logout();
            router.replace('/splashScreen');
          }
        }
      ]
    );
  };

  const handleQoERating = async (rating: number) => {
    if (!currentSession) return;
    
    try {
      const feedback: MosFeedbackData = {
        rating,
        technology: network,
        latitude: 0,
        longitude: 0
      };
      await apiService.uploadMosFeedback(currentSession.id, feedback);
      Alert.alert('Success', `QoE rating ${rating} submitted!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit QoE rating');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Ionicons name="location" size={20} color="#1565C0" />
          <Text style={styles.logoText}>DrivePulse</Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.battery}>85%</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Feather name="settings" size={20} color="#1565C0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* GAUGE */}
      <Gauge rssi={networkData.rssi} quality={networkData.quality} />

      {/* METRICS */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>RSRP</Text>
          <Text style={styles.metricValue}>{networkData.rsrp} dBm</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>SINR</Text>
          <Text style={styles.metricValue}>{networkData.sinr} dB</Text>
        </View>
      </View>

      {/* NETWORK TOGGLE */}
      <View style={styles.networkRow}>
        {["4G", "3G", "2G"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.networkButton, network === type && styles.networkActive]}
            onPress={() => handleNetworkChange(type)}
          >
            <Text
              style={[
                styles.networkText,
                network === type && styles.networkTextActive,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* INFO CARD */}
      <View style={styles.infoCard}>
        <InfoRow label="Cell ID" value={networkData.cellId} />
        <InfoRow label="Frequency" value={`${networkData.frequency} MHz`} />
        <InfoRow label="Bandwidth" value={`${networkData.bandwidth} MHz`} />
        <InfoRow label="PCI" value={networkData.pci.toString()} />
      </View>

      {/* QoE */}
      <QoEComponent onRatingSubmit={handleQoERating} />
    </SafeAreaView>
  );
}
