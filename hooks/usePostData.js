import api from "@/services/api";
import { useState } from "react";
import { Alert } from "react-native";

function usePostData() {
  const [isSaving, setIsSaving] = useState(false);

  // Function to handle POST request to API endpoint
  const postRequest = async (endpoint, data) => {
    setIsSaving(true);
    try {
      const response = await api.post(endpoint, data);
      if (response.success === true) {
        const successMessage = response.message || "Record Saved Successfully";
        Alert.alert("Success", successMessage);
      } else {
        Alert.alert("Error", response.message || "Unable to save record");
      }

      return response;
    } catch (error) {
      Alert.alert("Error", error.message || "Something Went Wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, postRequest };
}

export default usePostData;
