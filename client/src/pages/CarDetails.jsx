import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyCarData, assets } from "../assets/assets";
import Loader from "../components/Loader";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;

  useEffect(() => {
    setCar(dummyCarData.find((car) => car._id === id));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-8 text-gray-500 cursor-pointer hover:text-gray-700 transition"
      >
        <img
          src={assets.arrow_icon}
          alt=""
          className="rotate-180 opacity-65 w-5"
        />
        Back to all cars
      </button>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Car Details */}
        <div className="lg:w-2/3">
          {/* Car Image */}
          <div className="w-full h-96 rounded-xl overflow-hidden mb-8">
            <img
              src={car.image}
              alt={car.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Car Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {car.brand} {car.model}
            </h1>
            <p className="text-sm text-gray-600 mb-4">
              {car.category} • {car.year}
            </p>
            <div className="w-full h-px bg-gray-300"></div>
          </div>

          {/* Feature Cards in Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8">
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <img
                src={assets.users_icon}
                alt="seats"
                className="w-5 h-5 mx-auto mb-2"
              />
              <p className="text-gray-900 font-semibold text-sm">
                {car.seating_capacity} Seats
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <img
                src={assets.fuel_icon}
                alt="fuel"
                className="w-5 h-5 mx-auto mb-2"
              />
              <p className="text-gray-900 font-semibold text-sm">
                {car.fuel_type}
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <img
                src={assets.car_icon}
                alt="transmission"
                className="w-5 h-5 mx-auto mb-2"
              />
              <p className="text-gray-900 font-semibold text-sm">
                {car.transmission}
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-3 text-center">
              <img
                src={assets.location_icon}
                alt="location"
                className="w-5 h-5 mx-auto mb-2"
              />
              <p className="text-gray-900 font-semibold text-sm">
                {car.location}
              </p>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {car.description}
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={assets.check_icon}
                  alt="check"
                  className="w-4 h-4 text-primary shrink-0"
                />
                <span className="text-gray-700 text-sm">360 Camera</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.check_icon}
                  alt="check"
                  className="w-4 h-4 text-primary shrink-0"
                />
                <span className="text-gray-700 text-sm">Bluetooth</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.check_icon}
                  alt="check"
                  className="w-4 h-4 text-primary shrink-0"
                />
                <span className="text-gray-700 text-sm">GPS</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.check_icon}
                  alt="check"
                  className="w-4 h-4 text-primary shrink-0"
                />
                <span className="text-gray-700 text-sm">Heated Seats</span>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.check_icon}
                  alt="check"
                  className="w-4 h-4 text-primary shrink-0"
                />
                <span className="text-gray-700 text-sm">Rear View Mirror</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:w-1/3">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-6 shadow-lg sticky top-20 border border-gray-100"
          >
            {/* Price Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-primary">
                  {currency}
                  {car.pricePerDay}
                </span>
                <span className="text-gray-500 text-sm pb-1">per day</span>
              </div>
            </div>

            {/* Pickup Date */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Pickup Date
              </label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
              />
            </div>

            {/* Return Date */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Return Date
              </label>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
              />
            </div>

            {/* Book Now Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Book Now
            </button>

            {/* No Credit Card Required Note */}
            <p className="text-center text-gray-400 text-sm mt-4">
              No credit card required to reserve
            </p>
          </form>
        </div>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default CarDetails;
