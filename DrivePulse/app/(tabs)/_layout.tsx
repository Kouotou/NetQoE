import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Home, Map, Activity, FileText, Settings } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // 👇 All icons white
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",

        // 👇 Bottom tab background
        tabBarStyle: {
          backgroundColor: "#0D1117", // dark background (change if needed)
          borderTopWidth: 0,
          elevation: 0,
        },

        // 👇 Faint white shade when active
        tabBarActiveBackgroundColor: "rgba(255,255,255,0.08)",

        // 👇 Remove default ripple highlight
        tabBarButton: (props) => <HapticTab {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => <Map size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="speed"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <Activity size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="log"
        options={{
          title: "Logs",
          tabBarIcon: ({ color }) => <FileText size={26} color={color} />,
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
