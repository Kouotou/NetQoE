import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { mapScreenStyles as styles } from "@/styles";
import { locationService, LocationPoint } from "../../services/locationService";
import { useAuth } from "../../contexts/AuthContext";

export default function MapScreen() {
  const { logout } = useAuth();
  const [signalPath, setSignalPath] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 3.8480, // Cameroon coordinates
    longitude: 11.5021,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [stats, setStats] = useState({
    distance: '0.0 km',
    duration: '0m 0s',
    avgSignal: '0 dBm'
  });

  useEffect(() => {
    initializeLocation();
    return () => {
      locationService.stopTracking();
    };
  }, []);

  const initializeLocation = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setMapRegion(newRegion);
      
      // Generate mock path for demo
      const mockPath = locationService.generateMockPath(
        location.coords.latitude,
        location.coords.longitude
      );
      setSignalPath(mockPath);
      if (mockPath.length > 0) {
        setCurrentLocation(mockPath[mockPath.length - 1]);
        updateStats(mockPath);
      }
    }
  };

  const updateStats = (path: LocationPoint[]) => {
    if (path.length === 0) return;
    
    const avgRssi = path.reduce((sum, point) => sum + point.rssi, 0) / path.length;
    const duration = path.length > 1 ? 
      Math.floor((path[path.length - 1].timestamp - path[0].timestamp) / 1000) : 0;
    
    setStats({
      distance: `${(path.length * 0.1).toFixed(1)} km`, // Rough estimate
      duration: `${Math.floor(duration / 60)}m ${duration % 60}s`,
      avgSignal: `${Math.round(avgRssi)} dBm`
    });
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
            locationService.stopTracking();
            await logout();
          }
        }
      ]
    );
  };

  const centerOnUser = async () => {
    const location = await locationService.getCurrentLocation();
    if (location) {
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const getColorForSignal = (rssi: number): string => {
    if (rssi > -70) return '#22C55E'; // Excellent - Green
    if (rssi > -85) return '#1565C0'; // Good - Blue  
    if (rssi > -100) return '#F59E0B'; // Fair - Orange
    return '#EF4444'; // Poor - Red
  };

  const createPolylineSegments = () => {
    const segments = [];
    for (let i = 0; i < signalPath.length - 1; i++) {
      const currentPoint = signalPath[i];
      const nextPoint = signalPath[i + 1];
      
      segments.push({
        coordinates: [
          { latitude: currentPoint.latitude, longitude: currentPoint.longitude },
          { latitude: nextPoint.latitude, longitude: nextPoint.longitude }
        ],
        color: getColorForSignal(currentPoint.rssi)
      });
    }
    return segments;
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

      {/* MAP AREA */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Signal Path Polylines */}
          {createPolylineSegments().map((segment, index) => (
            <Polyline
              key={index}
              coordinates={segment.coordinates}
              strokeColor={segment.color}
              strokeWidth={4}
              lineCap="round"
              lineJoin="round"
            />
          ))}
          
          {/* Current Position Marker */}
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
              }}
              title={`Signal: ${currentLocation.rssi} dBm`}
              description={`Quality: ${currentLocation.quality}`}
            >
              <View style={[
                styles.currentLocationMarker,
                { backgroundColor: getColorForSignal(currentLocation.rssi) }
              ]} />
            </Marker>
          )}
        </MapView>

        {/* Floating Buttons */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity style={styles.blueFab} onPress={centerOnUser}>
            <Feather name="crosshair" size={18} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.grayFab}>
            <Feather name="layers" size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>Signal Strength</Text>
          <LegendItem color="#22C55E" text="> -70 dBm (Excellent)" />
          <LegendItem color="#1565C0" text="-70 to -85 dBm (Good)" />
          <LegendItem color="#F59E0B" text="-85 to -100 dBm (Fair)" />
          <LegendItem color="#EF4444" text="< -100 dBm (Poor)" />
        </View>
      </View>

      {/* Bottom Stats Card */}
      <View style={styles.statsCard}>
        <StatItem label="Distance" value={stats.distance} />
        <StatItem label="Duration" value={stats.duration} />
        <StatItem label="Avg Signal" value={stats.avgSignal} />
      </View>

      
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
