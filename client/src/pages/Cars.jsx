import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import CarCard from "../components/CarCard";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Cars = () => {
  //getting search params fro url
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get("pickupLocation");
  const pickupDate = searchParams.get("pickupDate");
  const returnDate = searchParams.get("returnDate");

  const { cars, axios } = useAppContext();

  const [input, setInput] = useState("");

  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredCars, setFilteredCars] = useState([]);

  const applyFilter = async () => {
    if (input === "") {
      setFilteredCars(cars);
      return null;
    }

    const filtered = cars.slice().filter((car) => {
      return (
        car.brand.toLowerCase().includes(input.toLowerCase()) ||
        car.model.toLowerCase().includes(input.toLowerCase()) ||
        car.category.toLowerCase().includes(input.toLowerCase()) ||
        car.transmission.toLowerCase().includes(input.toLowerCase())
      );
    });
    setFilteredCars(filtered);
  };

  const searchCarAvailability = async () => {
    const { data } = await axios.post("/api/bookings/check-availability", {
      location: pickupLocation,
      pickupDate,
      returnDate,
    });
    if (data.success) {
      setFilteredCars(data.availableCars);
      if (data.availableCars.length === 0) {
        toast("No cars available");
      }
      return null;
    }
  };

  useEffect(() => {
    isSearchData && searchCarAvailability();
  }, []);

  useEffect(() => {
    cars.length > 0 && !isSearchData && applyFilter();
  }, [input, cars]);

  return (
    <section className="bg-slate-50 py-18">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Available Cars
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Browse our selection of premium vehicles available for your next
            adventure
          </p>

          <div className="mt-6 w-full max-w-xl">
            <label htmlFor="car-search" className="sr-only">
              Search by make, model, or features
            </label>
            <div className="relative">
              <img
                src={assets.search_icon}
                alt="Search"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <input
                id="car-search"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search by make, model, or features"
                className="w-full rounded-full border border-slate-200 bg-white py-3.5 pl-12 pr-12 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 my-auto inline-flex h-9 items-center justify-center rounded-full bg-slate-100 px-2.5 text-slate-400 transition hover:bg-slate-200"
              >
                <img
                  src={assets.filter_icon}
                  alt="Filter"
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-600">
          Showing {filteredCars.length} Cars
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cars;
