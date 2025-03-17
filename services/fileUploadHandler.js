import { Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";

export const handleFileUpload = async (file, name, setForm) => {
  const uri = file.uri;
  const getFileName = uri.split("/").pop();
  if (file && file?.size && file?.size < 20000) {
    return Alert.alert("Error", "File size is smaller than 20Kb");
  } else if (getFileName.match(/\.(png|jpg|jpeg|gif|bmp|pdf|jfif)$/i)) {
    try {
      let compressedUri = uri;
      if (getFileName.match(/\.(png|jpg|jpeg)$/i)) {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          uri,
          [
            {
              resize: {
                width: name === "selfieImageFile" ? 200 : name === "imageFile" ? 200 : file?.width ? file?.width / 2 : 500,
                height: name === "selfieImageFile" ? 300 : name === "imageFile" ? 300 : file?.height ? file?.height / 2 : 700,
              },
            },
          ],
          { compress: 0.5 } // Adjusts to 50% of the original size
        );

        compressedUri = manipulatedImage.uri;
      }
      const base64String = await FileSystem.readAsStringAsync(compressedUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setForm((prevData) => ({
        ...prevData,
        [name]: base64String,
        [`${name}Name`]: getFileName,
        [`${name}Uri`]: uri,
      }));
    } catch (error) {
      Alert.alert("Error", error || "Failed to read file");
    }
  } else {
    Alert.alert("Error", "Invalid format");
  }
};

export const handleFileUploadJPGandPNG = async (uri, name, setForm) => {
  const getFileName = uri.split("/").pop();

  if (getFileName.match(/\.(png|jpg|jpeg)$/i)) {
    try {
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setForm((prevData) => ({
        ...prevData,
        [name]: base64String,
        [`${name}Name`]: getFileName,
        [`${name}Uri`]: uri,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to read file");
    }
  } else {
    Alert.alert("Error", "Invalid format");
  }
};

export const handleFileUploadPDFonly = async (uri, name, setForm) => {
  const getFileName = uri.split("/").pop();

  if (getFileName.match(/\.(pdf)$/i)) {
    try {
      const base64String = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setForm((prevData) => ({
        ...prevData,
        [name]: base64String,
        [`${name}Name`]: getFileName,
        [`${name}Uri`]: uri,
      }));
    } catch (error) {
      Alert.alert("Error", "Failed to read file");
    }
  } else {
    Alert.alert("Error", "Invalid format");
  }
};
