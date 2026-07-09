import React, { useState } from "react";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center pt-20 pb-28 px-6 md:px-16 lg:px-24 xl:px-32">
      <h2 className="font-semibold text-3xl md:text-4xl text-gray-900">
        Never Miss a Deal!
      </h2>
      <p className="text-sm md:text-base text-gray-500/90 mt-3 text-center">
        Subscribe to get the latest offers, new arrivals, and exclusive
        discounts
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-0 mt-8 w-full max-w-md"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email id"
          className="flex-1 px-4 py-2.5 border border-borderColor rounded-l-md outline-none text-sm text-gray-600 placeholder-gray-400 focus:border-primary transition-colors"
        />
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary hover:bg-primary-dull text-white text-sm font-medium rounded-r-md transition-colors cursor-pointer"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
