import { StyleSheet } from 'react-native'

export const settingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0e11',
    padding: 16,
  },

  card: {
    marginBottom: 16,
    borderRadius: 12,
  },

  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },

  helperText: {
    fontSize: 12,
    color: '#777',
    marginTop: 6,
  },

  button: {
    marginBottom: 10,
  },

  dangerButton: {
    marginTop: 10,
    backgroundColor: '#D32F2F',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },

  statItem: {
    alignItems: 'center',
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1565C0',
  },

  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});


