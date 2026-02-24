import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { logScreenStyles as styles } from "@/styles";
import { apiService, SessionData, EventData } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStorage } from '../../services/authStorage';
import { useRouter } from 'expo-router';

interface LogItem {
  id: string;
  type: 'handover' | 'speed_test' | 'drop' | 'call_start';
  time: string;
  title: string;
  location: string;
  extra: string;
  signal_strength?: number;
}

interface SessionItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  avgSignal: string;
  events: number;
  network: string;
  distance: number;
}


const LogScreen = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'logs' | 'sessions'>('logs');
  const [activeFilter, setActiveFilter] = useState<'all' | 'handover' | 'speed_test' | 'drop' | 'call_start'>('all');
  const [search, setSearch] = useState('');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [events, setEvents] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs' && selectedSessionId) {
      loadSessionEvents(selectedSessionId);
    }
  }, [activeTab, selectedSessionId]);

  const initializeData = async () => {
    const token = await AuthStorage.getToken();
    if (token) {
      apiService.setToken(token);
      loadSessions();
    }
  };

  const loadSessions = async () => {
    setLoading(true);
    try {
      const sessionsData = await apiService.getUserSessions();
      const formattedSessions = sessionsData.map(session => ({
        id: session.id,
        title: `Session ${new Date(session.start_time).toLocaleDateString()}`,
        date: new Date(session.start_time).toLocaleString(),
        duration: session.end_time ? 
          formatDuration(new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) : 
          'Ongoing',
        avgSignal: session.avg_rssi ? `${session.avg_rssi} dBm` : 'N/A',
        events: (session.drops_count || 0) + (session.handovers_count || 0) + (session.speedtest_count || 0),
        network: 'LTE',
        distance: session.total_distance_km || 0
      }));
      setSessions(formattedSessions);
      
      // Load events for the first session if available
      if (formattedSessions.length > 0) {
        setSelectedSessionId(formattedSessions[0].id);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      Alert.alert('Error', 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const loadSessionEvents = async (sessionId: string) => {
    setLoading(true);
    try {
      const eventsData = await apiService.getSessionEvents(sessionId);
      const formattedEvents = eventsData.map(event => ({
        id: event.id,
        type: event.event_type as 'handover' | 'speed_test' | 'drop' | 'call_start',
        time: new Date(event.recorded_at).toLocaleTimeString(),
        title: formatEventTitle(event.event_type),
        location: `${event.latitude.toFixed(4)}, ${event.longitude.toFixed(4)}`,
        extra: event.signal_strength ? `Signal: ${event.signal_strength} dBm` : '',
        signal_strength: event.signal_strength
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
      // Don't show error for missing events endpoint
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const formatEventTitle = (eventType: string): string => {
    switch (eventType) {
      case 'handover': return 'Handover Event';
      case 'speed_test': return 'Speed Test Completed';
      case 'drop': return 'Call Drop Detected';
      case 'call_start': return 'Call Started';
      default: return 'Network Event';
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
            await logout();
            router.replace('/splashScreen');
          }
        }
      ]
    );
  };

  /* -------------------- LOG FILTERING -------------------- */

  const filteredLogs =
    activeFilter === 'all'
      ? events
      : events.filter((log) => log.type === activeFilter);

  /* -------------------- SESSION SEARCH -------------------- */

  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(search.toLowerCase())
  );

  /* -------------------- CSV EXPORT -------------------- */

  const exportLogsToCSV = () => {
    Alert.alert('Export Logs', 'Export functionality will be implemented soon.');
  };

  const exportSessionsToCSV = () => {
    Alert.alert('Export Sessions', 'Export functionality will be implemented soon.');
  };

  /* -------------------- SESSION MANAGEMENT -------------------- */

  const deleteSession = async (id: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteSession(id);
              setSessions(sessions.filter(s => s.id !== id));
              Alert.alert('Success', 'Session deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session');
            }
          }
        }
      ]
    );
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'handover':
        return '#1976D2';
      case 'speed_test':
        return '#2E7D32';
      case 'drop':
        return '#D32F2F';
      case 'call_start':
        return '#FF9800';
      default:
        return '#1976D2';
    }
  };

  if (loading && (sessions.length === 0 || events.length === 0)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={{ marginTop: 10 }}>Loading data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>DrivePulse</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
          <TouchableOpacity onPress={() => {
            if (activeTab === 'sessions') {
              loadSessions();
            } else {
              if (selectedSessionId) {
                loadSessionEvents(selectedSessionId);
              }
            }
          }}>
            <Text style={styles.logoutButton}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutButton}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            {['all', 'drop', 'handover', 'speed_test', 'call_start'].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterButton,
                  activeFilter === item && styles.activeFilterButton,
                ]}
                onPress={() => setActiveFilter(item as any)}
              >
                <Text style={activeFilter === item ? styles.activeFilterText : styles.filterText}>
                  {item === 'speed_test' ? 'Speed Test' : item.charAt(0).toUpperCase() + item.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#1976D2" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredLogs.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 16 }}>No events found</Text>
                  <Text style={{ color: '#666', fontSize: 14, marginTop: 5 }}>Start a drive test to see events here</Text>
                </View>
              ) : (
                filteredLogs.map((log) => (
                  <View key={log.id} style={styles.card}>
                    <View style={[styles.iconCircle, { backgroundColor: getIconColor(log.type) }]} />
                    <View style={styles.cardContent}>
                      <Text style={styles.time}>{log.time}</Text>
                      <Text style={styles.title}>{log.title}</Text>
                      <Text style={styles.location}>{log.location}</Text>
                      <Text style={styles.extra}>{log.extra}</Text>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}

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

          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#1976D2" />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredSessions.length === 0 ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text style={{ color: '#666', fontSize: 16 }}>No sessions found</Text>
                  <Text style={{ color: '#666', fontSize: 14, marginTop: 5 }}>Complete a drive test to see sessions here</Text>
                </View>
              ) : (
                filteredSessions.map((session) => (
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

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedSessionId(session.id);
                          setActiveTab('logs');
                        }}
                      >
                        <Text style={{ color: '#1976D2', fontWeight: '600' }}>
                          View Events
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteSession(session.id)}
                      >
                        <Text style={{ color: '#EF4444', fontWeight: '600' }}>
                          Delete Session
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>
          )}

          <TouchableOpacity style={styles.exportButton} onPress={exportSessionsToCSV}>
            <Text style={styles.exportText}>Export Sessions as CSV</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default LogScreen;
