import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const testimonials = [
  {
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    image: assets.testimonial_image_1,
    rating: 5,
    feedback:
      "I've rented cars from various companies, but the experience with CarRental was exceptional.",
  },
  {
    name: "John Smith",
    location: "New York, USA",
    image: assets.testimonial_image_2,
    rating: 5,
    feedback:
      "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
  },
  {
    name: "Ava Johnson",
    location: "Sydney, Australia",
    image: assets.testimonial_image_1,
    rating: 5,
    feedback:
      "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
  },
];

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center py-18 px-6 md:px-16 lg:px-24 xl:px-32">
      <div>
        <Title
          title="What Our Customers Say"
          subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-[1200px]">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-300"
          >
            {/* User Info Header */}
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />
              <div className="flex flex-col">
                <h3 className="font-semibold text-gray-900 text-base leading-tight">
                  {t.name}
                </h3>
                <span className="text-xs text-gray-400 mt-1.5">
                  {t.location}
                </span>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <img
                  key={i}
                  src={assets.star_icon}
                  alt="star"
                  className="w-4.5 h-4.5 object-contain"
                />
              ))}
            </div>

            {/* Testimonial Quote */}
            <p className="text-gray-500/90 text-sm font-light leading-relaxed">
              "{t.feedback}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
