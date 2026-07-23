import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ClipboardList } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const statusStyles = {
  confirmed: "bg-emerald-50 text-emerald-600",
  cancelled: "bg-red-50 text-red-500",
  pending: "bg-amber-50 text-amber-600",
};

const ManageBookings = () => {
  const { currency, axios } = useAppContext();

  const [bookings, setBookings] = useState([]);

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/owner");
      data.success ? setBookings(data.bookings) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post("/api/bookings/change-status", {
        bookingId,
        status,
      });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="flex-1 bg-light min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 py-9">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Bookings
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-1">
            Manage Bookings
          </h1>
          <p className="text-gray-500 mt-2">
            Track all customer bookings, approve or cancel requests, and manage
            booking statuses.
          </p>
        </div>

        {/* Summary strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl px-6 py-6 sm:px-8 sm:py-7 bg-gradient-to-r from-primary to-primary-dull text-white flex items-center justify-between gap-5 flex-wrap"
        >
          <span className="grid place-items-center w-14 h-14 rounded-2xl bg-white/15 shrink-0">
            <ClipboardList size={26} />
          </span>
          <div className="flex items-center gap-8 flex-wrap">
            <div>
              <p className="text-3xl font-bold leading-none">
                {bookings.length}
              </p>
              <p className="text-sm text-white/85 mt-1.5">total bookings</p>
            </div>
            <div className="w-px h-10 bg-white/20 hidden sm:block" />
            <div>
              <p className="text-3xl font-bold leading-none">{pendingCount}</p>
              <p className="text-sm text-white/85 mt-1.5">
                awaiting your review
              </p>
            </div>
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
              <ClipboardList size={17} />
            </span>
            <h2 className="text-base font-semibold text-gray-800">
              All bookings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 grid place-items-center">
                <ClipboardList size={24} className="text-primary" />
              </div>
              <p className="font-semibold text-gray-700 text-lg">
                No bookings yet
              </p>
              <p className="text-sm text-gray-500">
                Customer bookings will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-gray-600">
                <thead className="text-gray-500 bg-light">
                  <tr>
                    <th className="p-4 font-semibold">Car</th>
                    <th className="p-4 font-semibold max-md:hidden">
                      Date Range
                    </th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4 font-semibold max-md:hidden">Payment</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <tr
                      key={index}
                      className="border-t border-borderColor hover:bg-light/60 transition-colors text-gray-600"
                    >
                      <td className="p-4 flex items-center gap-3.5">
                        <img
                          src={booking.car.image}
                          alt=""
                          className="h-14 w-14 aspect-square rounded-xl object-cover shrink-0"
                        />
                        <p className="font-semibold text-gray-800 text-[15px] max-md:hidden">
                          {booking.car.brand} {booking.car.model}
                        </p>
                      </td>

                      <td className="p-4 max-md:hidden">
                        {booking.pickupDate.split("T")[0]} →{" "}
                        {booking.returnDate.split("T")[0]}
                      </td>

                      <td className="p-4 font-semibold text-gray-800 text-[15px]">
                        {currency}
                        {booking.price}
                      </td>

                      <td className="p-4 max-md:hidden">
                        <span className="bg-light border border-borderColor px-3.5 py-1.5 rounded-full text-xs font-medium">
                          offline
                        </span>
                      </td>

                      <td className="p-4">
                        {booking.status === "pending" ? (
                          <select
                            onChange={(e) =>
                              changeBookingStatus(booking._id, e.target.value)
                            }
                            value={booking.status}
                            className="px-3 py-2 text-sm text-gray-600 border border-borderColor rounded-lg outline-none bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-colors"
                          >
                            <option value="pending">Pending</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="confirmed">Confirmed</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                              statusStyles[booking.status] ||
                              "bg-light text-gray-500"
                            }`}
                          >
                            {booking.status}
                          </span>
                        )}
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

export default ManageBookings;
