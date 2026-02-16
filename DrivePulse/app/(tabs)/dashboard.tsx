import React from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { dashboardScreenStyles as styles } from "@/styles";
import { useRouter } from "expo-router";
import { useState } from "react";

const Gauge = () => {
  const radius = 100;
  const strokeWidth = 14;
  const center = 120;
  const startAngle = Math.PI;
  const endAngle = Math.PI * 1.6;

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
        <Path
          d={describeArc(center, 120, radius, Math.PI, Math.PI * 2)}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={describeArc(center, 120, radius, startAngle, endAngle)}
          stroke="#F59E0B"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
        />
      </Svg>

      <View style={styles.gaugeText}>
        <Text style={styles.signalValue}>-96</Text>
        <Text style={styles.unit}>dBm</Text>
        <Text style={styles.signalStatus}>Fair</Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.title}>Network Monitor</Text>
      <Text style={styles.subtitle}>Real-time signal tracking</Text>

      <Gauge />

      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>RSRQ</Text>
          <Text style={styles.metricValue}>-25 dB</Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>SINR</Text>
          <Text style={styles.metricValue}>24 dB</Text>
        </View>
      </View>

      <View style={styles.networkToggle}>
        <Text style={[styles.networkButton, styles.activeButton]}>4G</Text>
        <Text style={styles.networkButton}>3G</Text>
        <Text style={styles.networkButton}>2G</Text>
      </View>

      <View style={styles.infoCard}>
        <InfoRow label="Cell ID" value="0x1A2B3C" />
        <InfoRow label="Frequency" value="2600 MHz" />
        <InfoRow label="Bandwidth" value="20 MHz" />
        <InfoRow label="PCI" value="156" />
      </View>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);
