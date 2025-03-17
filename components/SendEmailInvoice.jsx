import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, Alert } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import InputText from "./Inputs/InputText";
import usePostData from "@/hooks/usePostData";
import endpoints from "@/services/endpoints";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
const SendEmailInvoice = ({ visible, message, invoiceId, title = "", onCancel }) => {
  const [email, setEmail] = useState(null);
  const { isSaving, postRequest } = usePostData();
  const handleOnCancel = () => {
    setEmail(null);
    onCancel();
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && !email.includes(","); // Ensure email doesn't contain commas
  };
  const handleConfirm = async () => {
    if (isValidEmail(email)) {
      try {
        const res = await postRequest(endpoints.Invoice.sendOnClickPdfEmail, {
          invoiceId: invoiceId,
          emails: [email],
        });
        if (res) {
          handleOnCancel();
        }
      } catch (error) {
        Alert.alert("Error", error.message || "Error sending email");
      }
    } else {
      Alert.alert("Invalid email address", "Please enter a valid email address.");
    }
  };
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleOnCancel}>
      <View className="flex-1 justify-center items-center bg-black/75">
        <ThemedView className="w-4/5 border-2 border-slate-200 rounded-lg pb-5">
          {title && (
            <ThemedView className="flex-row justify-between border-b border-slate-200 px-4 py-2">
              <ThemedText className="text-xl font-pSemiBold">{title}</ThemedText>
              <TouchableOpacity onPress={handleOnCancel} disabled={isSaving}>
                <Text className="text-red">
                  <AntDesign name="closecircle" size={24} />
                </Text>
              </TouchableOpacity>
            </ThemedView>
          )}

          <ThemedText className="text-lg text-center mb-5 mx-2">{message}</ThemedText>
          <View className="flex flex-row justify-between items-center mb-5 mx-4">
            <View className="gap-4 w-full">
              <InputText
                placeholder="Email address here..."
                label="Enter Email Address"
                onChange={(email) => setEmail(email)}
                value={email}
              />
            </View>
          </View>

          <ThemedView className="flex-row justify-center gap-8">
            <TouchableOpacity className="bg-red rounded-full py-3 px-8 min-w-[60px]" onPress={handleOnCancel} disabled={isSaving}>
              <Text className="text-center text-white font-pSemiBold text-xl">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-primary rounded-full py-3 px-8 min-w-[60px] flex-row items-center gap-2"
              onPress={handleConfirm}
              disabled={isSaving}
            >
              <Text className="text-center text-white font-pSemiBold text-xl">Send</Text>
              <MaterialIcons name="send" size={24} color="white" />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </View>
    </Modal>
  );
};

export default SendEmailInvoice;
