import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false); // TODO: set false
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); //TODO: set true

  const handleLogout = async () => {
    const keys = ["user"];
    await AsyncStorage.multiRemove(keys);
    setUser(null);
    setIsLogged(false);
    router.push("/");
  };

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(JSON.parse(res));
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        handleLogout,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
