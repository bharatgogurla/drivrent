import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import MyBooking from "./pages/MyBooking";
import Footer from "./components/Footer";
import Layout from "./pages/owner/Layout";
import Dashboard from "./pages/owner/Dashboard";
import AddCar from "./pages/owner/AddCar";
import ManageCars from "./pages/owner/ManageCars";
import ManageBookings from "./pages/owner/ManageBookings";
import Login from "./components/Login";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

const PublicRoute = ({ children }) => {
  const { isOwner, loading, token } = useAppContext();

  if (loading) {
    return <Loader />;
  }

  if (token && isOwner) {
    return <Navigate to="/owner" replace />;
  }

  return children;
};

const RenterProtectedRoute = ({ children }) => {
  const { isOwner, loading, token, setShowLogin } = useAppContext();

  useEffect(() => {
    if (!loading && !token) {
      setShowLogin(true);
    }
  }, [loading, token, setShowLogin]);

  if (loading) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (isOwner) {
    return <Navigate to="/owner" replace />;
  }

  return children;
};

const OwnerProtectedRoute = ({ children }) => {
  const { isOwner, loading, token, setShowLogin } = useAppContext();

  useEffect(() => {
    if (!loading && (!token || !isOwner)) {
      if (!token) {
        setShowLogin(true);
      }
    }
  }, [loading, token, isOwner, setShowLogin]);

  if (loading) {
    return <Loader />;
  }

  if (!token || !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");
  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
        <Route path="/car-details/:id" element={<PublicRoute><CarDetails /></PublicRoute>} />
        <Route path="/cars" element={<PublicRoute><Cars /></PublicRoute>} />
        <Route path="/my-bookings" element={<RenterProtectedRoute><MyBooking /></RenterProtectedRoute>} />
        <Route path="/owner" element={<OwnerProtectedRoute><Layout /></OwnerProtectedRoute>}>
          <Route index element={<Dashboard />}></Route>
          <Route path="add-car" element={<AddCar />}></Route>
          <Route path="manage-cars" element={<ManageCars />}></Route>
          <Route path="manage-bookings" element={<ManageBookings />}></Route>
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
