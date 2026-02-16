import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import Svg, { Line, Circle } from "react-native-svg";
import { mapScreenStyles as styles } from "@/styles";

export default function MapScreen() {
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
          <Feather name="settings" size={20} color="#1565C0" />
        </View>
      </View>

      {/* MAP AREA */}
      <View style={styles.mapContainer}>
        <Svg height="100%" width="100%">
          {/* Grid lines */}
          {[...Array(6)].map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0%"
              y1={`${i * 20}%`}
              x2="100%"
              y2={`${i * 20}%`}
              stroke="#E5E7EB"
            />
          ))}

          {[...Array(6)].map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={`${i * 20}%`}
              y1="0%"
              x2={`${i * 20}%`}
              y2="100%"
              stroke="#E5E7EB"
            />
          ))}

          {/* Signal Path */}
          <Line
            x1="10%"
            y1="85%"
            x2="40%"
            y2="55%"
            stroke="#22C55E"
            strokeWidth="3"
          />
          <Line
            x1="40%"
            y1="55%"
            x2="65%"
            y2="35%"
            stroke="#F59E0B"
            strokeWidth="3"
          />
          <Line
            x1="65%"
            y1="35%"
            x2="85%"
            y2="20%"
            stroke="#EF4444"
            strokeWidth="3"
          />

          {/* Current Position */}
          <Circle cx="85%" cy="20%" r="6" fill="#1565C0" />
        </Svg>

        {/* Floating Buttons */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity style={styles.blueFab}>
            <Feather name="crosshair" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.grayFab}>
            <Feather name="layers" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Signal Strength</Text>
          <LegendItem color="#22C55E" text="> -80 dBm" />
          <LegendItem color="#F59E0B" text="-80 to -100 dBm" />
          <LegendItem color="#EF4444" text="< -100 dBm" />
        </View>
      </View>

      {/* Bottom Stats Card */}
      <View style={styles.statsCard}>
        <StatItem label="Distance" value="2.4 km" />
        <StatItem label="Duration" value="8m 45s" />
        <StatItem label="Avg Signal" value="-88 dBm" />
      </View>

      {/* Footer */}
      {/* <View style={styles.footer}>
        <FooterItem icon="activity" label="Dashboard" />
        <FooterItem icon="map" label="Map" active />
        <FooterItem icon="zap" label="Speed" />
        <FooterItem icon="file-text" label="Logs" />
        <FooterItem icon="settings" label="Settings" />
      </View> */}
    </SafeAreaView>
  );
}

const LegendItem = ({ color, text }: any) => (
  <View style={styles.legendRow}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={styles.legendText}>{text}</Text>
  </View>
);

const StatItem = ({ label, value }: any) => (
  <View style={styles.statItem}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

// const FooterItem = ({ icon, label, active }: any) => (
//   <View style={styles.footerItem}>
//     <Feather
//       name={icon}
//       size={18}
//       color={active ? "#1565C0" : "#9CA3AF"}
//     />
//     <Text
//       style={[
//         styles.footerText,
//         active && { color: "#1565C0" },
//       ]}
//     >
//       {label}
//     </Text>
//   </View>
// );
