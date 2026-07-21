import React from "react";
import { assets } from "../assets/assets";
import { motion } from "motion/react";

const Banner = () => {
  return (
    <section className="mx-auto mt-1 mb-16 w-full max-w-[1300px] overflow-hidden rounded-[40px] bg-linear-to-r from-[#0060FF] via-[#4A8BFF] to-[#96C5FF] px-8 shadow-[0_30px_90px_rgba(3,82,255,0.18)] text-white md:px-14 md:py-8">
      <div className="relative flex flex-col-reverse items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full max-w-lg text-center lg:text-left">
          <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl md:text-[32px] lg:text-[34px]">
            Do You Own a Luxury Car?
          </h1>
          <p className="mt-2 text-sm text-white/95 sm:text-sm md:text-sm xl:max-w-md">
            Monetize your vehicle effortlessly by listing it on CarRental. We
            take care of insurance, driver verification and secure payments — so
            you can earn passive income, stress-free.
          </p>
          <button className="mt-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/15 transition hover:-translate-y-0.5 hover:bg-slate-100">
            List your car
          </button>
        </div>

        <div className="relative w-full max-w-105 lg:mt-2">
          <div className="absolute -right-10 top-1/2 hidden h-28 w-65 -translate-y-1/2 rounded-full bg-white/10 blur-3xl lg:block" />
          <motion.img
            src={assets.banner_car_image}
            alt="Luxury car"
            className="relative mx-auto mt-2 w-full max-w-90 max-h-36 object-contain"
            initial={{
              opacity: 0,
              x: 60,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
