import React from "react";
import {
  View,
  Alert,
  ImageBackground,
  TouchableOpacity,
  Text,
} from "react-native";
import { images } from "@/constants";

const LogoutAlert = () => {
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            console.log("User logged out");
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ImageBackground
      source={images.bgLogout}
      className="flex-1 justify-center items-center"
    >
      <View className="flex-1 justify-center items-center w-[75%]">
        <View className="bg-white p-5 rounded-lg items-center justify-center">
          <Text className="text-xl font-bold text-black mb-1">Logout</Text>
          <Text className="text-sm  text-black">
            Are you sure, you want to logout?
          </Text>
          <View className="flex-row justify-between mt-4">
            <TouchableOpacity className="flex-1  bg-white p-2 border-2 border-[#4D4F5C] rounded-lg mr-2">
              <Text className="text-black text-center">Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-1  bg-[#293A96] p-2 border-2 border-[#293A96] rounded-lg">
              <Text className="text-white text-center">No</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LogoutAlert;
