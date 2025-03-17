import api from "@/services/api";
import { useState } from "react";
import { Alert } from "react-native";

function usePutData() {
  const [isSaving, setIsSaving] = useState(false);

  const postRequest = async (endpoint, data) => {
    setIsSaving(true);
    try {
      const response = await api.put(endpoint, data);
      if (response.success) {
        const successMessage = response.message || "Record Updated Successfully";
        Alert.alert("Success", successMessage);
      } else {
        Alert.alert("Error", response.message || "Unable to Update Record");
      }

      return response;
    } catch (error) {
      Alert.alert("Error", error.message || "Something Went Wrong");
    } finally {
      setIsSaving(false); // Reset saving state when request is finished
    }
  };

  return { isSaving, postRequest };
}

export default usePutData;
