import { StyleSheet } from "react-native";
export const dashboardScreenStyles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 20,
  },

  gaugeContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  gaugeText: {
    position: "absolute",
    alignItems: "center",
  },

  signalValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#F59E0B",
  },

  unit: {
    fontSize: 14,
    color: "#6B7280",
  },

  signalStatus: {
    marginTop: 4,
    fontSize: 14,
    color: "#F59E0B",
    fontWeight: "600",
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 20,
  },

  metric: {
    alignItems: "center",
  },

  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  networkToggle: {
    flexDirection: "row",
    marginVertical: 20,
    gap: 10,
  },

  networkButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    color: "#374151",
    fontWeight: "600",
  },

  activeButton: {
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
  },

  infoCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    elevation: 3,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoLabel: {
    color: "#6B7280",
  },

  infoValue: {
    fontWeight: "600",
    color: "#111827",
  },
});
