import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";
import { dashboardScreenStyles as styles } from "@/styles";

const Gauge = () => {
  const radius = 100;
  const strokeWidth = 14;
  const center = 120;

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

    return `
      M ${start.x} ${start.y}
      A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}
    `;
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
          d={describeArc(center, 120, radius, Math.PI, Math.PI * 1.75)}
          stroke="#1565C0"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.gaugeText}>
        <Text style={styles.signalValue}>-81</Text>
        <Text style={styles.unit}>dBm</Text>
        <Text style={styles.good}>Good</Text>
      </View>
    </View>
  );
};

const QoEComponent = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <View style={styles.qoeCard}>
      <Text style={styles.qoeTitle}>QoE Rating</Text>
      <Text style={styles.qoeSubtitle}>
        Rate your Quality of Experience
      </Text>

      <View style={styles.qoeRow}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.qoeButton,
              selected === num && styles.qoeSelected,
            ]}
            onPress={() => setSelected(num)}
          >
            <Text
              style={[
                styles.qoeText,
                selected === num && styles.qoeTextSelected,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function App() {
  const [network, setNetwork] = useState("4G");

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

      {/* GAUGE */}
      <Gauge />

      {/* METRICS */}
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>RSRQ</Text>
          <Text style={styles.metricValue}>-20 dB</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>SINR</Text>
          <Text style={styles.metricValue}>48 dB</Text>
        </View>
      </View>

      {/* NETWORK TOGGLE */}
      <View style={styles.networkRow}>
        {["4G", "3G", "2G"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.networkButton,
              network === type && styles.networkActive,
            ]}
            onPress={() => setNetwork(type)}
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
        <InfoRow label="Cell ID" value="0x1A2B3C" />
        <InfoRow label="Frequency" value="2600 MHz" />
        <InfoRow label="Bandwidth" value="20 MHz" />
        <InfoRow label="PCI" value="156" />
      </View>

      {/* QoE */}
      <QoEComponent
       />

      {/* FOOTER
      <View style={styles.footer}>
        <FooterItem icon="activity" label="Dashboard" active />
        <FooterItem icon="map" label="Map" />
        <FooterItem icon="zap" label="Speed" />
        <FooterItem icon="file-text" label="Logs" />
        <FooterItem icon="settings" label="Settings" />
      </View> */}
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
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
