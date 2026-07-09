import React, { useState } from "react";
import { dummyCarData, assets } from "../assets/assets";
import CarCard from "../components/CarCard";

const Cars = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use the dummyCarData defined in assets. Ignore any extra example entries elsewhere.
  const cars = dummyCarData || [];

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
          Showing {cars.length} Cars
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Cars;
