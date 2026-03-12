import React, { createContext, useEffect, useState } from "react";
import api from "../util/api";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // ================= LOAD PROFILE =================
  const getUserData = async () => {

    try {

      const { data } = await api.get("/profile");

      setUserData(data);
      setIsLoggedIn(true);

    } catch {

      setUserData(null);
      setIsLoggedIn(false);
    }
  };

  // ================= ON APP START =================
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token) {
      getUserData(); // try load profile
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }

  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};