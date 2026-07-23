// Dashboard.jsx
// Requires: chart.js and react-chartjs-2
//   npm install chart.js react-chartjs-2

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Car, ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const PRIMARY = "#2563eb";
const PRIMARY_DULL = "#1f58d8";
const AMBER = "#f59e0b";
const SLATE = "#c4c7d2";

const statusStyleFor = (status) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-600";
    case "cancelled":
      return "bg-red-50 text-red-500";
    default:
      return "bg-amber-50 text-amber-600";
  }
};

const Dashboard = () => {
  const { axios, isOwner, currency, user } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  });

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: Car },
    { title: "Total Bookings", value: data.totalBookings, icon: ClipboardList },
    { title: "Pending", value: data.pendingBookings, icon: Clock },
    { title: "Confirmed", value: data.completedBookings, icon: CheckCircle2 },
  ];

  const otherBookings = Math.max(
    data.totalBookings - data.pendingBookings - data.completedBookings,
    0,
  );

  const statusDoughnutData = {
    labels: ["Confirmed", "Pending", "Other"],
    datasets: [
      {
        data: [data.completedBookings, data.pendingBookings, otherBookings],
        backgroundColor: [PRIMARY, AMBER, SLATE],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  const overviewBarData = {
    labels: ["Cars", "Bookings", "Pending", "Confirmed"],
    datasets: [
      {
        data: [
          data.totalCars,
          data.totalBookings,
          data.pendingBookings,
          data.completedBookings,
        ],
        backgroundColor: [SLATE, PRIMARY, AMBER, PRIMARY_DULL],
        borderRadius: 8,
        maxBarThickness: 42,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { family: "Outfit", size: 12 } },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#6b7280",
          font: { family: "Outfit", size: 12 },
        },
        grid: { color: "#eef0f3" },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#6b7280",
          font: { family: "Outfit", size: 12 },
          boxWidth: 10,
          padding: 16,
        },
      },
    },
  };

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/owner/dashboard");
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  return (
    <div className="flex-1 bg-light min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 py-9">
        {/* Header */}
        <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
          Owner Console
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mt-1">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-2 max-w-xl">
          Monitor overall platform performance including total cars, bookings,
          revenue, and recent activity.
        </p>

        {/* Welcome / revenue hero — same gradient treatment as the profile header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl p-6 md:p-7 bg-gradient-to-r from-primary to-primary-dull text-white flex items-center justify-between gap-6 flex-wrap"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 grid place-items-center text-2xl font-bold shrink-0 overflow-hidden">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || "O"
              )}
            </div>
            <div>
              <p className="text-xl font-semibold">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </p>
              <p className="text-sm text-white/85 mt-1">
                Here's how your fleet is performing.
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs text-white/75 uppercase tracking-wide">
              Monthly revenue
            </p>
            <p className="text-4xl font-bold mt-1">
              {currency}
              {data.monthlyRevenue}
            </p>
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-5 mb-5">
          {dashboardCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 + index * 0.05 }}
              whileHover={{ y: -3 }}
              className="flex flex-col gap-3 p-5 rounded-2xl border border-borderColor bg-white hover:shadow-lg hover:shadow-primary/5 transition-shadow"
            >
              <span className="grid place-items-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                <card.icon size={22} />
              </span>
              <div>
                <p className="text-4xl font-bold text-gray-800 leading-none">
                  {card.value}
                </p>
                <h1 className="text-sm text-gray-500 mt-2">{card.title}</h1>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="flex flex-col xl:flex-row gap-5 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="p-5 md:p-6 border border-borderColor rounded-2xl bg-white w-full md:max-w-xs"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Booking Status
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Breakdown of all bookings
            </p>
            <div className="h-56 mt-4">
              {data.totalBookings > 0 ? (
                <Doughnut data={statusDoughnutData} options={doughnutOptions} />
              ) : (
                <div className="h-full grid place-items-center text-sm text-gray-400">
                  No bookings yet
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="p-5 md:p-6 border border-borderColor rounded-2xl bg-white flex-1 min-w-[280px]"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Platform Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cars and bookings at a glance
            </p>
            <div className="h-56 mt-4">
              <Bar data={overviewBarData} options={barOptions} />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-between items-start gap-5 mb-5 w-full">
          {/* recent booking */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="p-5 md:p-6 border border-borderColor rounded-2xl bg-white flex-1 min-w-[500px]"
          >
            <div className="flex items-center gap-3 mb-1">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
                <ClipboardList size={17} />
              </span>
              <h2 className="text-base font-semibold text-gray-800">
                Recent Bookings
              </h2>
            </div>
            <p className="text-gray-500 text-sm ml-12">
              Latest customer bookings
            </p>

            {data.recentBookings.length === 0 ? (
              <p className="text-sm text-gray-400 mt-6">
                No recent bookings yet.
              </p>
            ) : (
              data.recentBookings.map((booking, index) => (
                <div
                  key={index}
                  className="mt-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                      <Car size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">
                        {booking.car.brand} {booking.car.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.createdAt.split("T")[0]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-medium">
                    <p className="text-sm text-gray-500">
                      {currency}
                      {booking.price}
                    </p>
                    <p
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${statusStyleFor(booking.status)}`}
                    >
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))
            )}
          </motion.div>

          {/* monthly revenue detail */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="p-5 md:p-6 border border-borderColor rounded-2xl bg-white w-[320px] shrink-0"
          >
            <h2 className="text-base font-semibold text-gray-800">
              Monthly Revenue
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Revenue for current month
            </p>
            <p className="text-4xl mt-6 font-bold text-primary">
              {currency}
              {data.monthlyRevenue}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
