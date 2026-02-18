import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { logScreenStyles as styles } from "@/styles";

interface LogItem {
  id: number;
  type: 'handover' | 'speed Test' | 'drop';
  time: string;
  title: string;
  location: string;
  extra: string;
}

interface SessionItem {
  id: number;
  title: string;
  date: string;
  duration: string;
  avgSignal: string;
  events: number;
  network: 'LTE' | '3G';
}

/* -------------------- MOCK DATA -------------------- */

const logsData: LogItem[] = [
  {
    id: 1,
    type: 'handover',
    time: '12:04:22 PM',
    title: 'Handover: Cell A → Cell B',
    location: 'Main St & 5th Ave',
    extra: 'PCI: 156 → 234',
  },
  {
    id: 2,
    type: 'speed Test',
    time: '12:01:15 PM',
    title: 'Speed Test Completed',
    location: '3rd Ave & Broadway',
    extra: 'DL: 95.3 Mbps, UL: 42.1 Mbps',
  },
  {
    id: 3,
    type: 'drop',
    time: '11:58:42 AM',
    title: 'Call Drop Detected',
    location: 'Park Ave & 42nd St',
    extra: 'RSRP: -115 dBm',
  },
];

const sessionsData: SessionItem[] = [
  {
    id: 1,
    title: 'Main Street Route - LTE',
    date: 'Feb 4, 2026 12:00 PM',
    duration: '8m 45s',
    avgSignal: '-85 dBm',
    events: 12,
    network: 'LTE',
  },
  {
    id: 2,
    title: 'Downtown Loop - 3G',
    date: 'Feb 4, 2026 10:30 AM',
    duration: '15m 22s',
    avgSignal: '-92 dBm',
    events: 24,
    network: '3G',
  },
];

/* -------------------- COMPONENT -------------------- */

const LogScreen = () => {
  const [activeTab, setActiveTab] = useState<'logs' | 'sessions'>('logs');
  const [activeFilter, setActiveFilter] = useState<'all' | 'handover' | 'speed Test' | 'drop'>('all');
  const [search, setSearch] = useState('');

  /* -------------------- LOG FILTERING -------------------- */

  const filteredLogs =
    activeFilter === 'all'
      ? logsData
      : logsData.filter((log) => log.type === activeFilter);

  /* -------------------- SESSION SEARCH -------------------- */

  const filteredSessions = sessionsData.filter((session) =>
    session.title.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- CSV EXPORT -------------------- */

  const exportLogsToCSV = () => {
    // Here you will later integrate expo-file-system or react-native-fs
    Alert.alert('Export Logs', 'Logs exported successfully (mock).');
  };

  const exportSessionsToCSV = () => {
    Alert.alert('Export Sessions', 'Sessions exported successfully (mock).');
  };

  /* -------------------- SESSION MANAGEMENT -------------------- */

  const deleteSession = (id: number) => {
    Alert.alert('Delete Session', `Session ${id} deleted (mock).`);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'handover':
        return '#1976D2';
      case 'speed Test':
        return '#2E7D32';
      case 'drop':
        return '#D32F2F';
      default:
        return '#1976D2';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>DrivePulse</Text>

      {/* Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={activeTab === 'logs' ? styles.activeToggle : styles.inactiveToggle}
          onPress={() => setActiveTab('logs')}
        >
          <Text style={activeTab === 'logs' ? styles.activeToggleText : styles.inactiveToggleText}>
            Event Logs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={activeTab === 'sessions' ? styles.activeToggle : styles.inactiveToggle}
          onPress={() => setActiveTab('sessions')}
        >
          <Text style={activeTab === 'sessions' ? styles.activeToggleText : styles.inactiveToggleText}>
            Sessions
          </Text>
        </TouchableOpacity>
      </View>

      {/* -------------------- EVENT LOGS VIEW -------------------- */}

      {activeTab === 'logs' ? (
        <>
          <View style={styles.filterContainer}>
            {['all', 'drop', 'handover', 'speed Test'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  activeFilter === item && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(item as any)}
              >
                <Text style={activeFilter === item ? styles.activeFilterText : styles.filterText}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredLogs.map((log) => (
              <View key={log.id} style={styles.card}>
                <View style={[styles.iconCircle, { backgroundColor: getIconColor(log.type) }]} />
                <View style={styles.cardContent}>
                  <Text style={styles.time}>{log.time}</Text>
                  <Text style={styles.title}>{log.title}</Text>
                  <Text style={styles.location}>{log.location}</Text>
                  <Text style={styles.extra}>{log.extra}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.exportButton} onPress={exportLogsToCSV}>
            <Text style={styles.exportText}>Export Logs as CSV</Text>
          </TouchableOpacity>
        </>
      ) : (
        /* -------------------- SESSIONS VIEW -------------------- */
        <>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search sessions..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredSessions.map((session) => (
              <View
                key={session.id}
                style={[
                  styles.sessionCard,
                  {
                    borderLeftColor: session.network === 'LTE' ? '#10B981' : '#EF4444',
                  },
                ]}
              >
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <Text style={styles.sessionDate}>{session.date}</Text>

                <View style={styles.sessionRow}>
                  <View>
                    <Text style={styles.sessionLabel}>Duration</Text>
                    <Text style={styles.sessionValue}>{session.duration}</Text>
                  </View>
                  <View>
                    <Text style={styles.sessionLabel}>Avg Signal</Text>
                    <Text style={styles.sessionValue}>{session.avgSignal}</Text>
                  </View>
                  <View>
                    <Text style={styles.sessionLabel}>Events</Text>
                    <Text style={styles.sessionValue}>{session.events}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{ marginTop: 12 }}
                  onPress={() => deleteSession(session.id)}
                >
                  <Text style={{ color: '#EF4444', fontWeight: '600' }}>
                    Delete Session
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.exportButton} onPress={exportSessionsToCSV}>
            <Text style={styles.exportText}>Export Sessions as CSV</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default LogScreen;
