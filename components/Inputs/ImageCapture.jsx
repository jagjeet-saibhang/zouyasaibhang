import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Modal, BackHandler } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { handleFileUpload } from "@/services/fileUploadHandler";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";

const CaptureImage = ({ label = "", required = false, placeholder = "Capture", value, name, setForm, defaultRotate = 90 }) => {
  const theme = useColorScheme() ?? "light";

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
    return <Text className="text-center p-2">Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text className="text-center p-2">No access to camera</Text>;
  }

  return (
    <>
      <ThemedView className="w-full">
        {/* <View className={`items-center justify-center ${value ? "flex-1" : "hidden"}`}>
        {value ? (
          <View>
            <Image
              source={{ uri: value }}
              className="w-40 h-40 rounded-lg"
              fadeDuration={300}
              resizeMode="stretch"
              style={{ transform: [{ rotate: `${rotate}deg` }] }}
            />
            <TouchableOpacity
              onPress={() => setRotate(rotate + 90)}
              className="absolute bottom-2 right-2 bg-slate-50 p-1 rounded-full flex items-center justify-center opacity-50"
            >
              <Image source={icons.rotate} className="w-6 h-6" resizeMode="contain" />
            </TouchableOpacity>
          </View>
        ) : null}
      </View> */}
        <ThemedText className={`text-sm font-pRegular ml-3 mb-1`}>
          {label} {required && <Text className="text-red text-lg">*</Text>}
        </ThemedText>
        {value ? (
          <ThemedView className="w-full flex flex-row items-center justify-between p-4 rounded-full border border-[#C1C1C1]">
            <ThemedText style={{ color: "green" }}>Image Captured</ThemedText>
            <TouchableOpacity onPress={clearCapturedImage} className="flex flex-row items-center">
              <View>
                <Text className={`flex-1 text-right text-red`}>Remove Captured Image</Text>
              </View>
              <View>
                <Text className={`flex-1 text-right text-red`}>
                  <Entypo name="trash" size={20} />
                </Text>
              </View>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <TouchableOpacity onPress={openCamera} className="w-full p-2 rounded-full border border-[#C1C1C1] focus:border-secondary">
            <ThemedView className="flex flex-row items-center justify-between border border-dashed border-gray-400 rounded-full p-2">
              <ThemedText
                className={`${value ? "font-pRegular px-1" : "px-1"}  text-lg`}
                style={value ? { color: theme === "light" ? "#000" : "#fff" } : { color: "#c9c9c9" }}
              >
                {value ? label + " captured" : placeholder || label}
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
    </>
  );
};

export default CaptureImage;
