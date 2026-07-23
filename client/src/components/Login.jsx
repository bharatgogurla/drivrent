// Login.jsx
// Requires: lucide-react (icons), react-hot-toast, motion (framer-motion v11+ "motion/react")
// Uses the app's Outfit font + Tailwind theme tokens (--color-primary, --color-primary-dull,
// --color-light, --color-borderColor) — no extra font import needed since Outfit is already
// pulled in globally via your theme CSS.

import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Mail, Lock, User, Eye, EyeOff, MapPin, KeyRound } from "lucide-react";

// Role drives copy and the animated route accent — the toggle isn't just a
// filter, it changes what the panel is telling you. Both roles stay inside
// the theme's blue family: renters get the primary blue, owners get the
// slightly deeper "dull" shade, so the whole modal still reads as one brand.
const ROLE_CONTENT = {
  user: {
    label: "Renter",
    eyebrow: "FOR RENTERS",
    heading: "Wherever you're headed, there's a car waiting.",
    accent: "var(--color-primary)",
    icon: MapPin,
  },
  owner: {
    label: "Owner",
    eyebrow: "FOR OWNERS",
    heading: "Turn idle days into paid ones.",
    accent: "var(--color-primary-dull)",
    icon: KeyRound,
  },
};

const PlateBadge = ({ role, accent, dark }) => (
  <div className="flex items-center gap-2">
    <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
    <span
      className={`font-mono text-[11px] tracking-[0.15em] ${dark ? "text-white/70" : "text-gray-400"}`}
    >
      DRIVRENT 
    </span>
  </div>
);

const Field = ({ id, label, icon: Icon, accent, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div
        className="flex items-center gap-2.5 h-12 rounded-full border bg-white pl-5 pr-4 transition-colors motion-reduce:transition-none"
        style={{ borderColor: focused ? accent : "var(--color-borderColor)" }}
      >
        <Icon size={16} className="shrink-0" style={{ color: focused ? accent : "#9CA3AF" }} />
        <input
          id={id}
          {...props}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full border-none outline-none ring-0 bg-transparent text-sm text-[#171A1D] placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

const Login = () => {
  const { setShowLogin, axios, setToken, navigate } = useAppContext();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [role, setRole] = useState("user"); // "user" | "owner"
  const [showPassword, setShowPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const active = ROLE_CONTENT[role];

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { name, email, password } = formData;
      const payload = mode === "login" ? { email, password, role } : { name, email, password, role };
      const { data } = await axios.post(`/api/user/${mode}`, payload);

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        setShowLogin(false);
        navigate(data.role === "owner" ? "/owner" : "/", { replace: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={() => setShowLogin(false)}
      className="fixed inset-0 z-100 flex items-center justify-center bg-[#0f172a]/70 backdrop-blur-sm p-4"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[840px] grid grid-cols-1 md:grid-cols-[0.85fr_1fr] rounded-[28px] overflow-hidden shadow-2xl bg-light"
      >

        {/* Route panel — signature element: a dashed route that quietly travels
            the length of the card, echoing the idea of a trip in progress. */}
        <div className="relative hidden md:flex flex-col justify-between bg-[#0b1220] text-white px-8 py-9 overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 280 420"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M40 -20 C 90 60, 10 140, 60 220 S 180 340, 140 440"
              fill="none"
              stroke="#1e293b"
              strokeWidth="3"
              strokeDasharray="2 14"
              strokeLinecap="round"
            />
            <path
              d="M40 -20 C 90 60, 10 140, 60 220 S 180 340, 140 440"
              fill="none"
              stroke={active.accent}
              strokeWidth="3"
              strokeDasharray="2 14"
              strokeLinecap="round"
              className={prefersReducedMotion ? "" : "route-travel"}
            />
          </svg>

          <div className="relative z-[1]">
            <span
              className="inline-block text-[11px] tracking-[0.2em] font-semibold"
              style={{ color: active.accent }}
            >
              {active.eyebrow}
            </span>
            <h2
              className="mt-3 uppercase text-[28px] leading-[1.15] tracking-wide font-semibold"
            >
              {active.heading}
            </h2>
          </div>

          <div className="relative z-[1]">
            <PlateBadge role={role} accent={active.accent} dark />
          </div>
        </div>

        {/* Form panel */}
        <div className="px-7 py-9 sm:px-9 bg-white">
          <div className="md:hidden mb-6">
            <PlateBadge role={role} accent={active.accent} />
          </div>

          <h1 className="uppercase text-[26px] tracking-wide text-[#171A1D] font-semibold">
            {mode === "login" ? "Welcome back!" : "Create account"}
          </h1>
          <p className="text-sm text-gray-500 mt-1.5">
            {mode === "login"
              ? "Sign in to pick up where you left off."
              : "Set up your account and get on the road."}
          </p>

          {/* Role toggle — the sliding highlight and color carry through
              into the copy above and the button below, so switching it
              actually changes what you're being told, not just a filter. */}
          <div className="relative grid grid-cols-2 mt-6 h-11 rounded-full bg-light p-1">
            <motion.div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full motion-reduce:transition-none"
              style={{ background: active.accent }}
              animate={{ x: role === "owner" ? "calc(100% + 4px)" : "0%" }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: "easeOut" }}
            />
            {Object.entries(ROLE_CONTENT).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`relative z-[1] rounded-full text-sm font-medium transition-colors ${
                  role === key ? "text-white" : "text-gray-500"
                }`}
              >
                {val.label}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmitHandler} className="mt-6 flex flex-col gap-3.5">
            <AnimatePresence initial={false}>
              {mode === "register" && (
                <motion.div
                  key="name"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  className="overflow-hidden"
                >
                  <Field
                    id="name"
                    label="Full name"
                    icon={User}
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    accent={active.accent}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Field
              id="email"
              label="Email address"
              icon={Mail}
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              accent={active.accent}
              required
            />

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div
                className="relative flex items-center gap-2.5 h-12 rounded-full border bg-white pl-5 pr-4 transition-colors motion-reduce:transition-none"
                style={{ borderColor: passwordFocused ? active.accent : "var(--color-borderColor)" }}
              >
                <Lock size={16} className="shrink-0" style={{ color: passwordFocused ? active.accent : "#9CA3AF" }} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  className="w-full border-none outline-none ring-0 bg-transparent text-sm text-[#171A1D] placeholder:text-gray-400 pr-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <button
                type="button"
                className="self-start text-xs font-medium -mt-1"
                style={{ color: active.accent }}
              >
                Forgot password?
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 rounded-full text-white font-medium text-sm transition-opacity disabled:opacity-60"
              style={{ background: active.accent }}
            >
              {loading ? "One moment…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === "login" ? "New to DrivRent? " : "Already driving with us? "}
            <button
              type="button"
              onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
              className="font-medium"
              style={{ color: active.accent }}
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
