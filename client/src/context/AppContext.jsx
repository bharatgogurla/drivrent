import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [cars, setCars] = useState([]);

  // Function to check if user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      if (data.success) {
        setUser(data.user);
        setIsOwner(data.user.role === "owner");
      } else {
        logout(false);
        toast.error("Session expired. Please log in again.");
      }
    } catch (error) {
      logout(false);
      toast.error("Session expired. Please log in again.");
    } finally {
      setLoading(false);
    }
  };

  //  Functiom to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get("/api/user/cars");
      data.success ? setCars(data.cars) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Function to log out the user
  const logout = (showToast = true) => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsOwner(false);
    axios.defaults.headers.common["Authorization"] = "";
    if (showToast) {
      toast.success("You have been logged out");
    }
  };

  // useEffect to retrieve the token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token)
    fetchCars()
    if (!token) {
      setLoading(false);
    }
  }, []);

  // useEffect to fetch user data when token is available
  useEffect(() => {
    if (token) {
      setLoading(true);
      axios.defaults.headers.common["Authorization"] = `${token}`;
      fetchUser();
      setShowLogin(false);
    }
  }, [token]);

  // Prevent login modal from being shown if authenticated
  useEffect(() => {
    if (token && showLogin) {
      setShowLogin(false);
    }
  }, [token, showLogin]);

  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    token,
    setToken,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    loading,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
