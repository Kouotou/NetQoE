import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0057B7',
  success: '#28A745',
  textMain: '#1A202C',
  textSub: '#718096',
  background: '#FFFFFF',
};

export const speedScreenStyles = StyleSheet.create({
  // ... Re-use previous container, header, and bottomNav styles ...
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, paddingHorizontal: 20, alignItems: 'center' },
  
  // Ready Gauge
  readyContainer: { marginTop: 40, alignItems: 'center', justifyContent: 'center' },
  readyTextWrapper: { position: 'absolute', alignItems: 'center' },
  readyTitle: { fontSize: 32, fontWeight: '800', color: '#1A202C' },
  readySubtitle: { fontSize: 14, color: COLORS.textSub, marginTop: 4 },

  // Speed Cards
  speedRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 40 },
  speedCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  speedHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  speedLabel: { marginLeft: 6, fontSize: 14, color: COLORS.textSub, fontWeight: '500' },
  speedValue: { fontSize: 28, fontWeight: '700', color: '#1A202C' },
  speedUnit: { fontSize: 12, color: COLORS.textSub },

  // Latency (Ping/Jitter)
  latencyCard: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 15,
  },
  latencyItem: { flex: 1, alignItems: 'center' },
  latencyLabel: { fontSize: 12, color: COLORS.textSub, marginBottom: 4 },
  latencyValue: { fontSize: 16, fontWeight: '600', color: '#1A202C' },
  latencyDivider: { width: 1, height: '100%', backgroundColor: '#E2E8F0' },

  // Run Test Button
  runTestButton: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto', // Pushes to bottom of content area
    marginBottom: 100, // Adjusted for bottom nav space
  },
  runTestButtonDisabled: {
    backgroundColor: '#A0AEC0',
  },
  runTestText: { color: '#FFF', fontSize: 16, fontWeight: '800', letterSpacing: 1 },

  networkIndicator: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  networkText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Header & Nav (Duplicate from Dashboard for standalone use)
  header: { /* same as Dashboard */ flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  logoContainer: { flexDirection: 'row', alignItems: 'center' },
  logoIcon: { width: 32, height: 32, backgroundColor: COLORS.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', marginLeft: 8 },
  headerStatus: { flexDirection: 'row', alignItems: 'center' },
  batteryText: { marginLeft: 4, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%', height: 80, borderTopWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF', justifyContent: 'space-around', paddingTop: 10 },
  navItem: { alignItems: 'center' },
  navText: { fontSize: 10, marginTop: 4, color: '#A0AEC0' },
  navTextActive: { color: COLORS.primary, fontWeight: '700' },
});