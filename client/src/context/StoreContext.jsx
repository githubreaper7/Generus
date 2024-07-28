import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const expiryDate = localStorage.getItem("expiryDate");
    const currentTime = new Date().getTime();
    if (storedToken && expiryDate && currentTime < expiryDate) {
      setToken(storedToken);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("expiryDate");
    }
    setLoading(false);
  }, []);

  const contextValue = {
    token,
    loading,
    setToken: (newToken) => {
      setToken(newToken);
      if (newToken) {
        localStorage.setItem("token", newToken);
        const expiryDate = new Date().getTime() + 3600 * 1000; // 1 hour in milliseconds
        localStorage.setItem("expiryDate", expiryDate);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("expiryDate");
      }
    }
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
