import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
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


// --- Sub-Components ---

// 1. Central "Ready" Gauge
const ReadyGauge = () => (
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
    </Svg>
    <View style={styles.readyTextWrapper}>
      <Text style={styles.readyTitle}>Ready</Text>
      <Text style={styles.readySubtitle}>Tap to start</Text>
    </View>
  </View>
);

// 2. Metric Speed Card (Download/Upload)
const SpeedCard = ({ type, value }: { type: 'Download' | 'Upload', value: string }) => (
  <View style={styles.speedCard}>
    <View style={styles.speedHeader}>
      {type === 'Download' ? (
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
          <Satellite size={20} color={COLORS.primary} style={{marginLeft: 12}} />
        </View>
      </View>

      <View style={styles.content}>
        {/* Progress Circle Section */}
        <ReadyGauge />

        {/* Speed Cards Row */}
        <View style={styles.speedRow}>
          <SpeedCard type="Download" value="0.0" />
          <SpeedCard type="Upload" value="0.0" />
        </View>

        {/* Ping and Jitter Section */}
        <View style={styles.latencyCard}>
          <View style={styles.latencyItem}>
            <Text style={styles.latencyLabel}>Ping</Text>
            <Text style={styles.latencyValue}>0 ms</Text>
          </View>
          <View style={styles.latencyDivider} />
          <View style={styles.latencyItem}>
            <Text style={styles.latencyLabel}>Jitter</Text>
            <Text style={styles.latencyValue}>0 ms</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity style={styles.runTestButton} activeOpacity={0.8}>
          <Text style={styles.runTestText}>RUN TEST</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon={Activity} label="Dashboard" />
        <NavItem icon={MapIcon} label="Map" />
        <NavItem icon={Zap} label="Speed" active />
        <NavItem icon={FileText} label="Logs" />
        <NavItem icon={Settings} label="Settings" />
      </View>
    </SafeAreaView>
  );
}