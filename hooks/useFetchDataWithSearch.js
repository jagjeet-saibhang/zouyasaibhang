import api from "@/services/api";
import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";

function useFetchDataWithSearch(endpoint, additionalPayload = { statusId: "-2" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [payload, setPayload] = useState({
    search: {
      statusId: additionalPayload.statusId || "-2",
      customerId: additionalPayload.customerId || undefined,
      vendorId: additionalPayload.vendorId || undefined,
    },
  });

  const abortControllerRef = useRef(null);

  const handlePayloadChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("search.")) {
      const searchField = name.replace("search.", "");
      setPayload((prevPayload) => ({
        ...prevPayload,
        search: { ...prevPayload.search, [searchField]: value },
      }));
    } else {
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));
    }
  };

  const removeNullValues = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
          newObj[key] = removeNullValues(obj[key]);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  };

  const fetchData = async () => {
    if (!endpoint) {
      return;
    }
    setLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const cleanedPayload = removeNullValues(payload);

      const response = await api.post(endpoint, cleanedPayload, {
        signal: controller.signal,
      });

      setData(response);
    } catch (error) {
      if (error.name !== "AbortError") {
        Alert.alert(error.message || "Unable to retrieve records");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Cleanup to cancel any ongoing requests when the component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [payload, endpoint]);

  return { data, loading, payload, handlePayloadChange, fetchData };
}

export default useFetchDataWithSearch;
