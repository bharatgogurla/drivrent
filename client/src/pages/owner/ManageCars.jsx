import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Car, Eye, EyeOff, Trash2 } from "lucide-react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ManageCar = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [cars, setCars] = useState([]);

  const fetchOwnercars = async () => {
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post("/api/owner/toggle-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnercars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this car?",
      );

      if (!confirm) return null;

      const { data } = await axios.post("/api/owner/delete-car", { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnercars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnercars();
  }, [isOwner]);

  return (
    <div className="flex-1 bg-light min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 py-9">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Fleet
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-1">
            Manage Cars
          </h1>
          <p className="text-gray-500 mt-2">
            View all listed cars, update their availability, or remove them from
            the booking platform.
          </p>
        </div>

        {/* Summary strip — mirrors the gradient hero pattern used on the profile page */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-r from-primary to-primary-dull text-white flex items-center justify-between gap-5 flex-wrap"
        >
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white/15 shrink-0">
            <Car size={26} />
          </span>
          <div>
            <p className="text-3xl font-bold leading-none">{cars.length}</p>
            <p className="text-sm text-white/85 mt-1.5">
              {cars.length === 1 ? "car" : "cars"} currently listed
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl overflow-hidden border border-borderColor bg-white mt-6"
        >
          <div className="flex items-center gap-3 px-6 md:px-8 py-5 border-b border-borderColor">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary/10 text-primary">
              <Car size={17} />
            </span>
            <h2 className="text-base font-semibold text-gray-800">
              Your listings
            </h2>
          </div>

          {cars.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 grid place-items-center">
                <Car size={24} className="text-primary" />
              </div>
              <p className="font-semibold text-gray-700 text-lg">
                No cars listed yet
              </p>
              <p className="text-sm text-gray-500">
                Cars you add will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-600">
                <thead className="text-gray-500 bg-light">
                  <tr>
                    <th className="p-4 font-semibold">Car</th>
                    <th className="p-4 font-semibold max-md:hidden">
                      Category
                    </th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold max-md:hidden">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, index) => (
                    <tr
                      key={index}
                      className="border-t border-borderColor hover:bg-light/60 transition-colors"
                    >
                      <td className="p-4 flex items-center gap-3.5">
                        <img
                          src={car.image}
                          alt=""
                          className="h-14 w-14 aspect-square rounded-xl object-cover shrink-0"
                        />
                        <div className="max-md:hidden">
                          <p className="font-semibold text-gray-800 text-[15px]">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {car.seating_capacity} seats • {car.transmission}
                          </p>
                        </div>
                      </td>

                      <td className="p-4 max-md:hidden">{car.category}</td>
                      <td className="p-4 font-semibold text-gray-800 text-[15px]">
                        {currency}
                        {car.pricePerDay}
                        <span className="text-gray-400 font-normal text-sm">
                          /day
                        </span>
                      </td>

                      <td className="p-4 max-md:hidden">
                        <span
                          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                            car.isAvailable
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {car.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => toggleAvailability(car._id)}
                            title={
                              car.isAvailable
                                ? "Mark unavailable"
                                : "Mark available"
                            }
                            className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                          >
                            {car.isAvailable ? (
                              <Eye size={19} />
                            ) : (
                              <EyeOff size={19} />
                            )}
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => deleteCar(car._id)}
                            title="Delete car"
                            className="grid place-items-center w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={19} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ManageCar;
