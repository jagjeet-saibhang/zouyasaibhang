import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import LogoutAlert from "../components/Logout-Alert";
import { useGlobalContext } from "@/hooks/GlobalProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "./ThemedView";

const options = [
  { name: "Dashboard", icon: "view-dashboard-outline", route: "dashboard" },
  { name: "Trips", icon: "chevron-triple-up", route: "trips" },
  { name: "Payroll", icon: "payment", route: "payroll" },
  { name: "Profile", icon: "account-outline", route: "profile" },
  { name: "Notification", icon: "notifications-none", route: "notification" },
  { name: "Support", icon: "contact-support", route: "notification" },
];

const MainSideBar = (props) => {
  const [activeOption, setActiveOption] = useState("Dashboard");
  const theme = useColorScheme() ?? "light";
  const backgroundColor = useThemeColor(
    { light: "#EAEAEA", dark: "#333" },
    "background"
  );
  const textColor = useThemeColor({ light: "#000", dark: "#fff" }, "text");

  // const handlePress = (option) => {
  //   setActiveOption(option.name); // Set active option
  //   if (option.route) router.push(option.route); // Navigate if route exists
  // };
  const { user, setUser, setIsLogged } = useGlobalContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loggingOut = async () => {
    try {
      setIsLoggingOut(true);
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          { text: "Cancel", onPress: () => {} },
          {
            text: "Logout",
            onPress: async () => {
              try {
                await AsyncStorage.clear();
                setUser(null);
                setIsLogged(false);
                BackHandler.exitApp();
                return;
              } catch (error) {
                Alert.alert("Error", error.message || "An error occurred");
              }
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Error", error.message || "An error occurred");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigation = useNavigation();
  const handleBackButtonPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.push("/");
    }
  };

  const userData = { email: "test@example.com", fullName: "John Doe" };

  const [showLogoutAlert, setShowLogoutAlert] = useState(false); // State to toggle the LogoutAlert
  const handlePress = (option) => {
    setActiveOption(option.name); // Set active option
    if (option.route) router.push(option.route); // Navigate if route exists
    if (option.name === "Logout") {
      setShowLogoutAlert(true); // Show LogoutAlert when Logout is clicked
    }
  };

  return (
    <DrawerContentScrollView
      className="h-full w-full"
      style={{ backgroundColor: backgroundColor }}
    >
      <View className="px-4 py-5">
        {/* User Profile Section */}
        <UserProfile user={userData} />

        {/* Divider */}
        <View className="border-b border-gray-300 dark:border-gray-600 my-4" />

        {/* Options List */}
        <View>
          {options.map((option) => (
            <TouchableOpacity
              key={option.name}
              className={`flex-row items-center my-2 px-5 py-4 rounded-xl border border-gray-300 ${
                activeOption === option.name
                  ? "bg-[#293A96]"
                  : theme === "dark"
                  ? "bg-dark"
                  : "bg-white"
              }`}
              onPress={() => handlePress(option)}
              //style={{ backgroundColor: backgroundColor }}
            >
              {/* Icon */}
              {getIcon(option.icon, theme, activeOption === option.name)}

              {/* Option Name */}
              <Text
                className={`ml-3 ${
                  activeOption === option.name
                    ? "text-white text-lg font-semibold"
                    : theme === "dark"
                    ? "font-medium text-base text-white"
                    : "font-medium text-base text-black"
                }`}
              >
                {option.name}
              </Text>
            </TouchableOpacity>
          ))}
          <LogoutButton handleLogout={loggingOut} />
        </View>
      </View>
      {showLogoutAlert && <LogoutAlert />}
    </DrawerContentScrollView>
  );
};

export default MainSideBar;

const UserProfile = ({ user }) => {
  return (
    <ThemedView className="flex-row items-center mb-4 p-3 rounded-xl">
      {/* User Image */}
      <Image
        source={{ uri: "https://via.placeholder.com/58" }} // Replace with `images.vehicle11` if applicable
        className="w-14 h-14 rounded-full border-2 border-gray-300"
      />
      <View className="ml-3">
        <ThemedText className="text-lg font-semibold">
          {user?.fullName}
        </ThemedText>
        <ThemedText className="text-sm text-gray-600">{user?.email}</ThemedText>
      </View>
    </ThemedView>
  );
};

const getIcon = (iconName, theme, isActive) => {
  const iconColor = isActive ? "white" : theme === "dark" ? "white" : "black";
  const iconSize = isActive ? 26 : 24;
  switch (iconName) {
    case "view-dashboard-outline":
      return (
        <MaterialCommunityIcons
          name="view-dashboard-outline"
          size={iconSize}
          color={iconColor}
        />
      );
    case "chevron-triple-up":
      return (
        <MaterialCommunityIcons
          name="chevron-triple-up"
          size={iconSize}
          color={iconColor}
        />
      );
    case "payment":
      return <MaterialIcons name="payment" size={iconSize} color={iconColor} />;
    case "account-outline":
      return (
        <MaterialCommunityIcons
          name="account-outline"
          size={iconSize}
          color={iconColor}
        />
      );
    case "notifications-none":
      return (
        <MaterialIcons
          name="notifications-none"
          size={iconSize}
          color={iconColor}
        />
      );
    case "contact-support":
      return (
        <MaterialIcons
          name="contact-support"
          size={iconSize}
          color={iconColor}
        />
      );
    default:
      return null;
  }
};
const LogoutButton = ({ handleLogout }) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center my-2 px-5 py-4 rounded-xl bg-red-400`}
      onPress={() => handleLogout()}
    >
      <AntDesign name="logout" size={24} color={"white"} />
      <Text className={`ml-3 text-base font-medium text-white`}>Log Out</Text>
    </TouchableOpacity>
  );
};
