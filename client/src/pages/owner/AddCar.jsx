import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Car,
  Tag,
  Settings2,
  MapPin,
  FileText,
  Camera,
  Check,
} from "lucide-react";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const inputClass =
  "px-4 py-3 mt-1.5 text-[15px] border border-borderColor rounded-xl outline-none bg-white transition-colors focus:border-primary focus:ring-4 focus:ring-primary/10";

const SectionCard = ({ icon: Icon, title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    className="bg-white border border-borderColor rounded-2xl p-6 md:p-8"
  >
    <div className="flex items-center gap-3 mb-5">
      <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon size={19} />
      </span>
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </div>
    {children}
  </motion.div>
);

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({
    brand: "",
    model: "",
    year: 0,
    pricePerDay: 0,
    category: "",
    transmission: "",
    fuel_type: "",
    seating_capacity: 0,
    location: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("carData", JSON.stringify(car));

      const { data } = await axios.post("/api/owner/add-car", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setCar({
          brand: "",
          model: "",
          year: 0,
          pricePerDay: 0,
          category: "",
          transmission: "",
          fuel_type: "",
          seating_capacity: 0,
          location: "",
          description: "",
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-light min-h-screen">
      <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-14 py-9">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            Vehicle Listing
          </p>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-1">
            Add New Car
          </h1>

          <p className="text-gray-500 mt-2">
            Fill in details to list a new car for booking, including pricing,
            availability and vehicle specifications.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          {/* Hero photo card — gradient, mirrors the profile header treatment */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl px-6 py-6 sm:px-8 sm:py-7 overflow-hidden bg-gradient-to-r from-primary to-primary-dull text-white flex items-center justify-between gap-4 flex-wrap"
          >
            <div className="flex items-center gap-5">
              <label
                htmlFor="car-image"
                className="cursor-pointer group shrink-0"
              >
                <div className="relative h-20 w-20 rounded-2xl bg-white/15 border-2 border-white/30 overflow-hidden grid place-items-center group-hover:border-white/60 transition-colors">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Camera size={26} className="text-white/80" />
                  )}
                </div>
                <input
                  type="file"
                  id="car-image"
                  accept="image/*"
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
              <div>
                <p className="text-lg font-semibold">
                  {car.brand || car.model
                    ? `${car.brand} ${car.model}`.trim()
                    : "Your car photo"}
                </p>
                <label
                  htmlFor="car-image"
                  className="text-sm text-white/85 underline underline-offset-2 cursor-pointer"
                >
                  {image ? "Change photo" : "Upload a photo"}
                </label>
              </div>
            </div>

            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/15 text-sm font-medium">
              New listing
            </span>
          </motion.div>

          {/* Basics */}
          <SectionCard icon={Car} title="Basics" delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Brand
                </label>
                <input
                  type="text"
                  placeholder="e.g. BMW, Mercedes, Audi..."
                  required
                  className={inputClass}
                  value={car.brand}
                  onChange={(e) => setCar({ ...car, brand: e.target.value })}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. X5, E-Class, M4..."
                  required
                  className={inputClass}
                  value={car.model}
                  onChange={(e) => setCar({ ...car, model: e.target.value })}
                />
              </div>
            </div>
          </SectionCard>

          {/* Pricing & category */}
          <SectionCard icon={Tag} title="Pricing & category" delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Year
                </label>
                <input
                  type="number"
                  placeholder="2026"
                  required
                  className={inputClass}
                  value={car.year}
                  onChange={(e) => setCar({ ...car, year: e.target.value })}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Daily Price ({currency})
                </label>
                <input
                  type="number"
                  placeholder="100"
                  required
                  className={inputClass}
                  value={car.pricePerDay}
                  onChange={(e) =>
                    setCar({ ...car, pricePerDay: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>
                <select
                  onChange={(e) => setCar({ ...car, category: e.target.value })}
                  value={car.category}
                  className={inputClass}
                >
                  <option value="">Select a category</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* Specifications */}
          <SectionCard icon={Settings2} title="Specifications" delay={0.15}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Transmission
                </label>
                <select
                  onChange={(e) =>
                    setCar({ ...car, transmission: e.target.value })
                  }
                  value={car.transmission}
                  className={inputClass}
                >
                  <option value="">Select a transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="Semi-Automatic">Semi-Automatic</option>
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Fuel Type
                </label>
                <select
                  onChange={(e) =>
                    setCar({ ...car, fuel_type: e.target.value })
                  }
                  value={car.fuel_type}
                  className={inputClass}
                >
                  <option value="">Select a fuel type</option>
                  <option value="Gas">Gas</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-sm font-medium text-gray-600">
                  Seating Capacity
                </label>
                <input
                  type="number"
                  placeholder="4"
                  required
                  className={inputClass}
                  value={car.seating_capacity}
                  onChange={(e) =>
                    setCar({ ...car, seating_capacity: e.target.value })
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* Location */}
          <SectionCard icon={MapPin} title="Location" delay={0.2}>
            <select
              onChange={(e) => setCar({ ...car, location: e.target.value })}
              value={car.location}
              className={inputClass + " w-full md:max-w-sm"}
            >
              <option value="">Select a location</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Houston">Houston</option>
              <option value="Chicago">Chicago</option>
            </select>
          </SectionCard>

          {/* Description */}
          <SectionCard icon={FileText} title="Description" delay={0.25}>
            <textarea
              rows={4}
              placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
              required
              className={inputClass + " w-full"}
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            ></textarea>
          </SectionCard>

          <div className="flex justify-end mt-5">
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-medium text-[15px] transition-colors disabled:opacity-60 shadow-sm shadow-primary/30"
            >
              <Check size={18} />
              {isLoading ? "Listing..." : "List Your Car"}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
