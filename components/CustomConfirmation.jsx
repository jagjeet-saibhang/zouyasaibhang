import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

const CustomConfirmation = ({ visible, message, cancelBtnTitle = "No", confirmBtnTitle = "Yes", title = "", onConfirm, onCancel }) => {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 justify-center items-center bg-black/75">
        <ThemedView className="w-4/5 border-2 border-slate-200 rounded-lg pb-5">
          {title && (
            <ThemedView className="flex-row justify-between mb-5 border-b border-slate-200 px-4 py-2">
              <ThemedText className="text-xl font-pSemiBold">{title}</ThemedText>
              <TouchableOpacity onPress={onCancel}>
                <Text className="text-red">
                  <AntDesign name="closecircle" size={24} />
                </Text>
              </TouchableOpacity>
            </ThemedView>
          )}
          <ThemedText className="text-lg text-center mb-5 mx-2">{message}</ThemedText>
          <ThemedView className="flex-row justify-center gap-8">
            <TouchableOpacity className="bg-red rounded-full py-3 px-8 min-w-[60px]" onPress={onCancel}>
              <Text className="text-center text-white font-pSemiBold text-xl">{cancelBtnTitle}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-primary rounded-full py-3 px-8 min-w-[60px]" onPress={onConfirm}>
              <Text className="text-center text-white font-pSemiBold text-xl">{confirmBtnTitle}</Text>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default CustomConfirmation;
