import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const TopBar = ({ text, iconLeft, IconRight, onUpdate }) => {
  return (
    <View className="flex-row justify-between p-4">
      <TouchableOpacity onPress={onUpdate}>
        <Image source={iconLeft} />
      </TouchableOpacity>
      <Text className="text-lg font-semibold">{text}</Text>
      {IconRight && (
        <View>
          <Image source={IconRight} />
        </View>
      )}
    </View>
  );
};

export default TopBar;
