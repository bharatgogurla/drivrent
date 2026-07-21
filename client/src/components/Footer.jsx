import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

const Footer = () => {
  return (
    <motion.footer
     initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 pt-23 w-full text-gray-600"
    >
      {/* Top section */}
      <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-gray-300 pb-8">
        {/* Brand column */}
        <div className="max-w-xs">
          <Link to="/" className="flex items-center gap-1 mb-4">
            <img src="/favicon.svg" alt="logo" className="h-9 w-8" />
            <span className="text-2xl font-bold text-gray-700">DrivRent</span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed">
            Premium car rental service with a wide selection of luxury and
            everyday vehicles for all your driving needs.
          </p>
          <div className="flex items-center gap-3 mt-5">
            <a href="#" aria-label="Facebook">
              <img
                src={assets.facebook_logo}
                alt="Facebook"
                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="#" aria-label="Instagram">
              <img
                src={assets.instagram_logo}
                alt="Instagram"
                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="#" aria-label="Twitter">
              <img
                src={assets.twitter_logo}
                alt="Twitter"
                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              />
            </a>
            <a href="#" aria-label="Email">
              <img
                src={assets.gmail_logo}
                alt="Email"
                className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Links columns */}
        <div className="flex flex-wrap gap-12 md:gap-20">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 text-md mb-4">
              QUICK LINKS
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/cars"
                  className="hover:text-primary transition-colors"
                >
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  List Your Car
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-800 text-md mb-4">
              RESOURCES
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 text-md mb-4">
              CONTACT
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>kamraj Nagar</li>
              <li>Antophill Church, Mumbai-400037</li>
              <li>+91 8828613709</li>
              <li>bharatgogurla@gmail.com</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-5 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} DrivRent All rights reserved.</p>
        <div className="flex items-center gap-3 mt-3 sm:mt-0">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy
          </a>
          <span>|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms
          </a>
          <span>|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Cookies
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
