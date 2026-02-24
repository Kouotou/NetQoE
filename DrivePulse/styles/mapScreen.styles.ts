import { StyleSheet } from "react-native";
export const mapScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  logoText: {
    fontSize: 16,
    fontWeight: "600",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  battery: {
    fontSize: 14,
  },

  mapContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  floatingButtons: {
    position: "absolute",
    right: 15,
    bottom: 80,
    gap: 12,
  },

  blueFab: {
    backgroundColor: "#1565C0",
    padding: 14,
    borderRadius: 30,
    elevation: 4,
  },

  grayFab: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 30,
    elevation: 4,
  },

  legendCard: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    elevation: 4,
  },

  legendTitle: {
    fontWeight: "600",
    marginBottom: 6,
  },

  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
  },

  statsCard: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderRadius: 16,
    marginVertical: 12,
  },

  statItem: {
    alignItems: "center",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  statValue: {
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  footerItem: {
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  currentLocationMarker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
});
