import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

const CustomAlert = ({ visible, onClose, message }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 justify-center items-center bg-black/75">
        <ThemedView className="w-4/5 border-2 border-slate-200 rounded-lg pb-5">
          <ThemedText className="text-lg text-center mb-5">{message}</ThemedText>
          <ThemedView className="flex-row justify-center gap-x-4">
            <TouchableOpacity className="bg-primary rounded-md py-2 px-4 min-w-[60px]" onPress={onClose}>
              <Text className="text-center text-white font-bold">OK</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default CustomAlert;
