import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Modal, BackHandler } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { handleFileUpload } from "@/services/fileUploadHandler";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraView, Camera } from "expo-camera";
export default function CaptureFile({ name,fileName:file_name, placeholder, setForm, value, label, required = false, defaultRotate = 90 }) {
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

  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facing, setFacing] = useState("back");
  const [rotate, setRotate] = useState(defaultRotate);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const clearCapturedImage = () => {
    setForm((prevData) => ({
      ...prevData,
      [name]: null,
      [`${name}Name`]: null,
      [`${name}Uri`]: null,
    }));
    setFileName(null);
  };
  const openCamera = () => {
    setIsCameraOpen(true);
  };

  const closeCamera = () => {
    setIsCameraOpen(false);
  };

  const captureImage = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      handleFileUpload(photo, name, setForm);
      setIsCameraOpen(false); // Close the camera after capturing
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      setIsCameraOpen(false);
      return true; // Prevent default back button behavior
    });

    return () => backHandler.remove();
  }, []);

  if (hasPermission === null) {
    return <Text className="text-center p-2">Requesting permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text className="text-center p-2">Permission not granted</Text>;
  }
  return (
    <View className="w-full gap-4">
      <ThemedView className="flex-row items-center justify-between">
        <ThemedText className="text-sm font-pRegular mx-3 -mb-3">
          {label}
          {required && <Text className="text-red text-lg">*</Text>}
        </ThemedText>

        <ThemedText className="text-sm font-pRegular mx-3 -mb-3 text-right">
          {label}
          {required && <Text className="text-red text-lg">*</Text>}
        </ThemedText>
      </ThemedView>
      <ThemedView className="flex flex-row items-center justify-between gap-2">
        <View className="w-44">
          <TouchableOpacity
            onPress={fileName && value ? null : handleDocumentSelection}
            className={`p-2 rounded-full text-lg font-pRegular border border-[#C1C1C1] focus:border-secondary ${
              theme === "light" ? "bg-white text-black " : "bg-[#383838] text-white"
            }`}
          >
            {value || file_name ? (
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
                  {placeholder ? "Choose File" : label}
                </ThemedText>
              </ThemedView>
            )}
          </TouchableOpacity>
        </View>
        <View>
          <ThemedText>OR</ThemedText>
        </View>
        <ThemedView className="w-44">
          {value || file_name ? (
            <ThemedView className="flex flex-row items-center justify-between p-4 rounded-full border border-[#C1C1C1]">
              <ThemedText style={{ color: "green" }}>Image Captured</ThemedText>
              <TouchableOpacity onPress={clearCapturedImage}>
                <Text className={`flex-1 text-right text-red`}>
                  <Entypo name="trash" size={20} />
                </Text>
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <TouchableOpacity onPress={openCamera} className="p-2 rounded-full border border-[#C1C1C1] focus:border-secondary">
              <ThemedView className="flex flex-row items-center justify-between border border-dashed border-gray-400 rounded-full p-2">
                <ThemedText
                  className={`${value ? "font-pRegular px-1" : "px-1"}  text-lg`}
                  style={value ? { color: theme === "light" ? "#000" : "#fff" } : { color: "#c9c9c9" }}
                >
                  {value ? label + " captured" : "Capture" || label}
                </ThemedText>
                <Text className={`flex-1 text-right ${theme === "light" ? "text-primary" : "text-secondary"}`}>
                  <Entypo name="camera" size={24} />
                </Text>
              </ThemedView>
            </TouchableOpacity>
          )}
          {/* CameraView Modal */}
          <Modal visible={isCameraOpen} animationType="slide" transparent={false}>
            <View className="flex-1">
              <CameraView style={{ flex: 1 }} facing={facing} ref={(ref) => setCamera(ref)}>
                <View className="absolute bottom-8 w-full flex-row justify-center items-center space-x-7">
                  <TouchableOpacity onPress={captureImage} className="bg-white px-4 py-2 rounded-2xl">
                    <Text className="text-black text-lg">Capture</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFacing(facing === "back" ? "front" : "back")} className="bg-white rounded-full mx-4">
                    <FontAwesome6 name="repeat" size={24} color="black" className="p-2" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeCamera} className="bg-red px-3 py-2 rounded-2xl">
                    <Text className="text-white text-lg">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          </Modal>
        </ThemedView>
      </ThemedView>
    </View>
  );
}
