import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Loader } from "@/components/ui";
import PrimaryLink from "@/components/ui/PrimaryLink";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Redirect, router } from "expo-router";
import React, { useState } from "react";
import { images } from "@/constants";

import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import CustomConfirmation from "@/components/CustomConfirmation";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useColorScheme } from "@/hooks/useColorScheme";
const Home = () => {
  //const theme = useColorScheme() ?? "light";

  // const screenWidth = Dimensions.get("window").width;
  //const color = useThemeColor({ light: lightColor, dark: darkColor }, "background");
  const { loading, isLogged, handleLogout, user } = useGlobalContext();

  // State for confirmation dialog visibility and message
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // Show confirmation dialog
  const showConfirmation = () => setConfirmationVisible(true);

  // Handle cancel action in confirmation dialog
  const onCancel = () => {
    setConfirmationVisible(false);
  };

  // Handle confirm action in confirmation dialog
  const onConfirm = async () => {
    await handleLogout();
    setConfirmationVisible(false);
  };

  const clickLogout = () => {
    setConfirmationMessage("Are you sure you want to log out?");
    showConfirmation();
  };

  if (loading) {
    <Loader isLoading={loading} />;
  }
  if (!loading && !isLogged) return <Redirect href="/sign-in" />;
  return (
    <SafeAreaView className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <CustomConfirmation
          title="Logout"
          visible={confirmationVisible}
          message={confirmationMessage}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
        <Header clickLogout={clickLogout} />
        <NavigationButtons userType={user?.userType} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
function Header({ clickLogout }) {
  const theme = useColorScheme() ?? "light";

  return (
    <ThemedView className="p-4">
      <TouchableOpacity className="flex flex-row justify-end items-center" onPress={clickLogout}>
        <Text className={`${theme === "light" ? "text-red" : "text-yellow"}`}>
          <AntDesign name="logout" size={18} />
        </Text>
        <Text className={`text-2xl ml-2 font-pSemiBold ${theme === "light" ? "text-red" : "text-yellow"}`}>Logout</Text>
      </TouchableOpacity>
      <ThemedText className="text-3xl text-center font-pBold">Welcome!</ThemedText>
      <ThemedText className="text-2xl text-center font-bold italic">How can we help you?</ThemedText>
    </ThemedView>
  );
}

function NavigationButtons({ userType }) {
  // Navigation list with routes, titles, icons, and background colors
  const navList = [
    {
      title: "Profile \nManagement",
      route: "/profile",
      bgColor: "bg-red",
      icon: <FontAwesome name="user" size={40} color="#095256" />,
      navIcon: <FontAwesome name="edit" size={24} color="white" />,
    },
    ...(userType === 2
      ? [
          {
            title: "Staff \nManagement",
            route: "/staff-list",
            bgColor: "bg-yellow",
            icon: <FontAwesome6 name="user-nurse" size={40} color="#095256" />,
            navIcon: <FontAwesome name="arrow-right" size={24} color="white" />,
          },
        ]
      : []),
    ...(userType === 3
      ? [
          {
            title: "Services",
            route: "/services",
            bgColor: "bg-yellow",
            icon: <MaterialIcons name="dashboard" size={40} color="#095256" />,
            navIcon: <FontAwesome name="arrow-right" size={24} color="white" />,
          },
        ]
      : []),
    {
      title: "Invoice \nManagement",
      route: "/invoice-management",
      bgColor: "bg-green",
      icon: <FontAwesome name="file-text" size={40} color="#095256" />,
      navIcon: <FontAwesome name="arrow-right" size={24} color="white" />,
    },
    ...(userType === 3
      ? [
          {
            title: "Feedback",
            route: "/feedback",
            bgColor: "bg-red",
            icon: <FontAwesome6 name="person-circle-check" size={40} color="#095256" />,
            navIcon: <FontAwesome name="arrow-right" size={24} color="white" />,
          },
          {
            title: "Emergency \nContacts",
            route: "/sos",
            bgColor: "bg-yellow",
            icon: <MaterialIcons name="contact-emergency" size={40} color="brown" />,
            navIcon: <FontAwesome name="phone" size={24} color="white" />,
          },
        ]
      : []),
  ];

  return (
    <ThemedView className="w-full h-full p-4">
      {/* Map through navList and create TouchableOpacity for each item */}
      {navList.map((nav, index) => (
        <TouchableOpacity
          key={nav.title+index}
          className="w-full h-32 mb-4"
          onPress={() => {
            // Navigate to the specified route
            router.push(nav.route);
          }}
        >
          <View className={`${nav.bgColor} px-4 py-6 rounded-3xl relative`}>
            {/* Absolute Positioned Background Image */}
            <View className="absolute -top-5 left-0 w-28 h-28 opacity-50 z-0">
              <Image source={images.home_box_bg} resizeMode="contain" className="w-full h-full rotate-180" />
            </View>
            {/* Content */}
            <View className="flex flex-row items-center">
              <View className="rounded-full bg-white p-2 w-20 h-20 flex justify-center items-center">
                <Text>{nav.icon}</Text>
              </View>
              <View className="flex-1 pl-6">
                <Text className="text-white text-2xl font-pMedium">{nav.title}</Text>
              </View>
              <View className="mr-4">
                <Text>{nav.navIcon}</Text>
              </View>
            </View>
            {/* Absolute Positioned Background Image */}
            <View className="absolute -bottom-5 right-0 w-28 h-28 opacity-50 z-0">
              <Image source={images.home_box_bg} resizeMode="contain" className="w-full h-full" />
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
}
