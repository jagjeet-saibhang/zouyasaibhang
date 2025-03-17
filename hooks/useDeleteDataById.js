import api from "@/services/api";
import { useState } from "react";
import { Alert } from "react-native";
function useDeleteDataById() {
  const [deleting, setDeleting] = useState(false);
  const deleteRecord = async (endpoint) => {
    setDeleting(true);
    try {
      const response = await api.delete(endpoint);

      if (response) {
        Alert.alert("Deleted Successfully");
      } else {
        Alert.alert("Unable to Delete Record");
      }
    } catch (error) {
      Alert.alert(error.message || "Something Went Wrong");
    } finally {
      setDeleting(false); // Reset deleting state when request is finished
    }
  };

  return { deleteRecord, deleting };
}

export default useDeleteDataById;
