import { StyleSheet } from "react-native";
export const dashboardScreenStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 20,
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

  gaugeContainer: {
    alignItems: "center",
    marginVertical: 10,
  },

  gaugeText: {
    position: "absolute",
    alignItems: "center",
  },

  signalValue: {
    fontSize: 44,
    fontWeight: "700",
    color: "#1565C0",
  },

  unit: {
    fontSize: 14,
    color: "#6B7280",
  },

  good: {
    fontSize: 14,
    color: "#1565C0",
    fontWeight: "600",
    marginTop: 4,
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  metric: { alignItems: "center" },

  metricLabel: { fontSize: 12, color: "#6B7280" },

  metricValue: { fontSize: 16, fontWeight: "600" },

  networkRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 10,
  },

  networkButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },

  networkActive: {
    backgroundColor: "#1565C0",
  },

  networkText: {
    fontWeight: "600",
    color: "#374151",
  },

  networkTextActive: {
    color: "#FFFFFF",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  infoLabel: { color: "#6B7280" },

  infoValue: { fontWeight: "600" },

  qoeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    marginVertical: 10,
  },

  qoeTitle: {
    fontWeight: "600",
    fontSize: 14,
  },

  qoeSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 10,
  },

  qoeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  qoeButton: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 10,
    borderRadius: 10,
    width: 50,
    alignItems: "center",
  },

  qoeSelected: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },

  qoeText: {
    fontWeight: "600",
  },

  qoeTextSelected: {
    color: "#15803D",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "auto",
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
});