import JWT from "expo-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = {
  baseURL: "https://api.eldercare.co.in/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

async function sendRequest(url, method = "GET", data = null) {
  const userString = await AsyncStorage.getItem("user"); // Retrieve token from storage
  const user = userString ? JSON.parse(userString) : null; // Parse JSON string to object

  const headers = {
    ...api.headers,
  };
  
  if (user && user?.token) {
    // console.log("decodedToken", user?.token); 

    const key = "73AE92E6113F4369A713A94C5A9C6B15";
    try {
      const decodedToken = JWT.decode(user?.token, key); // Use expo-jwt to decode the token
      
      const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

      if (decodedToken && decodedToken.exp < currentTime) {
        await AsyncStorage.clear(); // Clear expired token
        throw new Error("Session expired. Please log in again.");
      }

      headers.Authorization = `Bearer ${user.token}`;
    } catch (error) {
      await AsyncStorage.clear(); // Clear expired token
      throw new Error("Invalid token. Please log in again.");
    }
  }

  const requestOptions = {
    method,
    headers,
  };

  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  const errorMessages = {
    400: "400: Bad Request",
    401: "401: Unauthorized",
    403: "403: Forbidden",
    404: "404: Not Found",
    413: "413: Payload Too Large",
    500: "500: Internal Server Error",
    502: "502: Bad Gateway",
    503: "503: Service Unavailable",
    504: "504: Gateway Timeout",
  };

  try {
    const response = await fetch(api.baseURL + url, requestOptions);

    if (errorMessages[response.status]) {
      throw new Error(errorMessages[response.status]);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED")) {
      throw new Error("Unable to connect to the server. Please check your internet connection or try again later.");
    } else {
      throw error;
    }
  }
}

export default {
  get: (url) => sendRequest(url, "GET"),
  post: (url, data) => sendRequest(url, "POST", data),
  put: (url, data) => sendRequest(url, "PUT", data),
  delete: (url) => sendRequest(url, "DELETE"),
};
