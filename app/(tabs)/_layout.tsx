import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Image, Platform, Text, View } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ThemedView } from "@/components/ThemedView";

export default function TabLayout() {
  const { loading, isLogged } = useGlobalContext();

  const tabScreens = [
    {
      name: "home",
      title: "Home",
      iconType: "MaterialIcons",
      iconName: "dashboard",
      path: "/home",
    },
    {
      name: "requests",
      title: "Requests",
      iconType: "Entypo",
      iconName: "list",
      path: "/requests",
    },
    {
      name: "about",
      title: "About",
      iconType: "MaterialIcons",
      iconName: "error-outline",
      path: "/about",
    },
  ];

  const hiddenTabScreens = [
    "profile",
    "feedback",
    "invoice-management",
    "sos",
    // "new-request",
    "services",
    "request-details",
    "staff-list",
    "staff-details",
    "add-staff",
  ];

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <ThemedView className="flex-1">
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#c9c9c9",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#095256",
            height: 80,
            borderTopWidth: 0,
            borderTopStartRadius: 16,
            borderTopEndRadius: 16,
            ...Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: "absolute",
              },
              default: {},
            }),
          },
          tabBarIconStyle: { minWidth: 100, marginTop: 20 },
        }}
      >
        {tabScreens.map((tab) => (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              headerShown: false,
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  iconType={tab.iconType}
                  iconName={tab.iconName}
                  color={color}
                  name={tab.title}
                  focused={focused}
                />
              ),
            }}
          />
        ))}
        {hiddenTabScreens.map((tab) => (
          <Tabs.Screen
            name={tab}
            key={tab}
            options={{ headerShown: false, href: null }}
          />
        ))}
      </Tabs>
    </ThemedView>
  );
}

const TabIcon = ({
  iconType,
  iconName,
  color,
  name,
  focused,
}: {
  iconType: string;
  iconName: string;
  color: string;
  name: string;
  focused: boolean;
}) => {
  const IconComponent =
    iconType === "Feather"
      ? Feather
      : iconType === "MaterialCommunityIcons"
      ? MaterialCommunityIcons
      : iconType === "Ionicons"
      ? Ionicons
      : iconType === "FontAwesome"
      ? FontAwesome
      : iconType === "Entypo"
      ? Entypo
      : iconType === "MaterialIcons"
      ? MaterialIcons
      : null;

  return (
    <View
      className={`flex items-center justify-center gap-1 ${
        focused ? "-mt-6 h-[60px] w-[90px] rounded-full" : ""
      }`}
    >
      {focused && <ThemedView className="w-10 h-3 rounded-full" />}
      {IconComponent && (
        <IconComponent name={iconName as any} size={24} color={color} />
      )}
      <Text
        className={`text-center ${
          focused ? "font-pSemiBold text-lg" : "font-pRegular text-sm"
        }`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};
