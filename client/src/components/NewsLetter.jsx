import React, { useState } from "react";
import { motion } from "motion/react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-28 px-6 md:px-16 lg:px-24 xl:px-32">

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-semibold text-3xl md:text-4xl text-gray-900">
          Never Miss a Deal!
        </h2>

        <p className="text-sm md:text-base text-gray-500/90 mt-3">
          Subscribe to get the latest offers, new arrivals, and exclusive
          discounts
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center gap-0 mt-8 w-full max-w-md"
      >
        <motion.input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email id"
          whileFocus={{ scale: 1.02 }}
          className="flex-1 px-4 py-2.5 border border-borderColor rounded-l-md outline-none text-sm text-gray-600 placeholder-gray-400 focus:border-primary transition-colors"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="px-6 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-r-md transition-colors cursor-pointer"
        >
          Subscribe
        </motion.button>
      </motion.form>
    </div>
  );
};

export default NewsLetter;
