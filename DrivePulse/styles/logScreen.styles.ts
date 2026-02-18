import { StyleSheet } from 'react-native';

export const logScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  activeToggle: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    alignItems: 'center',
  },
  inactiveToggle: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeToggleText: {
    fontWeight: '600',
  },
  inactiveToggleText: {
    color: '#777',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1565C0',
  },
  filterText: {
    color: '#333',
    fontSize: 13,
  },
  activeFilterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    elevation: 2,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#555',
  },
  extra: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  exportButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 12,
  },
  exportText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },

  /* Sessions Styles */
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sessionDate: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sessionValue: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
});


