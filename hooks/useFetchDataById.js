import api from "@/services/api";
import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";

function useFetchDataById(endpoint) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const abortControllerRef = useRef(null); // Ref to store AbortController

  const fetchData = async () => {
    if (!endpoint) return; // Avoid making requests if the endpoint is undefined/null

    setLoading(true);

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the current request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await api.get(endpoint, { signal: controller.signal });
      if (response) {
        setData(response);
      } else {
        Alert.alert("Error", "Something went wrong");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        // Ignore errors caused by request cancellation
        const errorMessage = error.message || "An error occurred";
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Cleanup function to cancel any ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [endpoint]); // Fetch data whenever the endpoint changes

  return { data, loading, setLoading, fetchData };
}

export default useFetchDataById;
