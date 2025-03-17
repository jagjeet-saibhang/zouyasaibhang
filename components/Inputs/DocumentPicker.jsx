import React, { useState } from "react";
import { TouchableOpacity, Alert, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { handleFileUpload } from "@/services/fileUploadHandler";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Entypo from "@expo/vector-icons/Entypo";
const DocumentPickerComponent = ({ name,fileName:file_name, placeholder = "Choose File", value, setForm, label, required = false }) => {
  const theme = useColorScheme() ?? "light";

  const [fileName, setFileName] = useState(null);

  const handleDocumentSelection = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/jpg", "image/png"], // Allow only PDF, JPEG, JPG, or PNG
        multiple: false, // Set to true for multiple file selection
      });

      if (!result.canceled && result.assets.length > 0) {
        handleFileUpload(result.assets[0], name, setForm);
        setFileName(result.assets[0]?.name);
      }
    } catch (error) {
      Alert.alert(error.message || "An error occurred");
    }
  };
  const clearCapturedImage = () => {
    setForm((prevData) => ({
      ...prevData,
      [name]: null,
      [`${name}Name`]: null,
      [`${name}Uri`]: null,
    }));
    setFileName(null);
  };
  return (
    <>
      <ThemedText className="text-sm font-pRegular ml-3 -mb-3 w-full">
        {label}
        {required && <Text className="text-red text-lg">*</Text>}
      </ThemedText>
      <TouchableOpacity
        onPress={handleDocumentSelection}
        className={`w-full p-2 rounded-full text-lg font-pRegular border border-[#C1C1C1] focus:border-secondary ${
          theme === "light" ? "bg-white text-black " : "bg-[#383838] text-white"
        }`}
      >
        {fileName ||file_name|| value ? (
          <ThemedView className="flex flex-row items-center justify-between mr-2 py-2">
            <View>
              <ThemedText className="text-lg" style={{ color: "green" }}>
                File Selected
              </ThemedText>
            </View>
            <TouchableOpacity onPress={clearCapturedImage}>
              <Text className={`flex-1 text-right text-red`}>
                <Entypo name="trash" size={20} />
              </Text>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedView className="w-auto border border-dashed border-gray-400 rounded-full flex flex-row items-center p-2">
            <Text className={theme === "light" ? "text-primary" : "text-secondary"}>
              <MaterialIcons name="cloud-upload" size={24} />
            </Text>
            <ThemedText className="text-lg mx-2" style={value ? { color: theme === "light" ? "#000" : "#fff" } : { color: "#c9c9c9" }}>
              {placeholder ? placeholder : label}
            </ThemedText>
          </ThemedView>
        )}
      </TouchableOpacity>
    </>
  );
};

export default DocumentPickerComponent;
