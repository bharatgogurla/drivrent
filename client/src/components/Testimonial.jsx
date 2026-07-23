import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const testimonials = [
  {
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    image: assets.testimonial_image_1,
    rating: 5,
    feedback:
      "I've rented cars from various companies, but the experience with DrivRent was exceptional.",
  },
  {
    name: "John Smith",
    location: "New York, USA",
    image: assets.testimonial_image_2,
    rating: 5,
    feedback:
      "DrivRent made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
  },
  {
    name: "Ava Johnson",
    location: "Sydney, Australia",
    image: assets.testimonial_image_1,
    rating: 5,
    feedback:
      "I highly recommend DrivRent! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const Testimonial = () => {
  return (
    <div className="flex flex-col items-center py-18 px-6 md:px-16 lg:px-24 xl:px-32">
      {/* Title Animation */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Title
          title="What Our Customers Say"
          subTitle="Discover why discerning travelers choose StayVenture for their luxury accommodations around the world."
        />
      </motion.div>

      {/* Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full max-w-[1200px]"
      >
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 18,
            }}
            className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100/80 shadow-[0_15px_40px_rgba(0,0,0,0.04)] flex flex-col gap-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)]"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />

              <div>
                <h3 className="font-semibold text-gray-900">{t.name}</h3>

                <span className="text-xs text-gray-400 mt-1 block">
                  {t.location}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <motion.img
                  key={i}
                  src={assets.star_icon}
                  alt="star"
                  className="w-4.5 h-4.5"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.2 + i * 0.08,
                    duration: 0.25,
                  }}
                />
              ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-500/90 text-sm font-light leading-relaxed">
              "{t.feedback}"
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Testimonial;
