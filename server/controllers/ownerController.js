import imagekit from "../configs/imageKit.js";
import User from "../models/User.js";
import Car from "../models/Car.js";
import fs from "fs";
import Booking from "../models/Booking.js";
import bcrypt from "bcrypt";

//API to Change Role of User
export const changeToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to List Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    let car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    // Upload Image to ImageKit
    const response = await imagekit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // optimization through imageKit URL transformation
    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        {
          width: 1280, // Width resizing
          quality: "auto", //Auto compression
          format: "webp", // Convert to modern format
        },
      ],
    });

    const image = optimizedImageUrl;
    await Car.create({ ...car, owner: _id, image });

    res.json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to list Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // Checking is car belongs to the user
    if (car.owner.toString() != _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    // Checking is car belongs to the user
    if (car.owner.toString() != _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.owner = null;
    car.isAvailable = false;

    await car.save();

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });
    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // Calculate monthlyRevenue from bookings where status is confirmed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue,
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Helper function to delete image from ImageKit by URL of owner
export const deleteImageFromImageKit = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes("imagekit.io")) return;
  try {
    let path = "";
    if (imageUrl.includes("/users/")) {
      path = "/users/" + imageUrl.split("/users/")[1].split("?")[0];
    } else if (imageUrl.includes("/cars/")) {
      path = "/cars/" + imageUrl.split("/cars/")[1].split("?")[0];
    }

    if (path) {
      const filename = path.split("/").pop();
      const nameWithoutExt =
        filename.substring(0, filename.lastIndexOf(".")) || filename;
      const files = await imagekit.files.list({
        searchQuery: `name LIKE "${nameWithoutExt}%"`,
      });
      if (files && files.length > 0) {
        await imagekit.files.delete(files[0].fileId);
      }
    }
  } catch (error) {
    console.error("ImageKit file deletion failed:", error.message);
  }
};

// API to update user image of owner
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id);
    if (user && user.image) {
      await deleteImageFromImageKit(user.image);
    }

    const imageFile = req.file;

    // Upload Image to ImageKit
    const response = await imagekit.files.upload({
      file: fs.createReadStream(imageFile.path),
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // optimization through imageKit URL transformation
    const optimizedImageUrl = imagekit.helper.buildSrc({
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
      src: response.filePath,
      transformation: [
        {
          width: 400, // Width resizing
          quality: "auto", //Auto compression
          format: "webp", // Convert to modern format
        },
      ],
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, { image });
    res.json({ success: true, message: "Image Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Owner Profile (Name, Phone)
export const updateProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    let { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: "Name is required" });
    }

    name = name.trim();
    phone = phone ? phone.trim() : "";

    const user = await User.findByIdAndUpdate(
      _id,
      { name, phone },
      { new: true },
    );

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change Owner Password
export const changePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.json({
        success: false,
        message: "All password fields are required",
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Incorrect current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Profile Image of owner
export const deleteProfileImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.image) {
      await deleteImageFromImageKit(user.image);
    }

    user.image = "";
    await user.save();

    res.json({ success: true, message: "Profile image deleted", user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Delete Account permanently of owner
export const deleteAccount = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;

    if (!password) {
      return res.json({
        success: false,
        message: "Password verification is required",
      });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    // 1. Find all cars belonging to the user
    const cars = await Car.find({ owner: _id });

    // 2. Delete all car images from ImageKit
    for (const car of cars) {
      if (car.image) {
        await deleteImageFromImageKit(car.image);
      }
    }

    // 3. Delete cars from DB
    await Car.deleteMany({ owner: _id });

    // 4. Delete bookings associated with user (either as renter or owner of car)
    await Booking.deleteMany({
      $or: [{ user: _id }, { owner: _id }],
    });

    // 5. Delete profile image from ImageKit
    if (user.image) {
      await deleteImageFromImageKit(user.image);
    }

    // 6. Delete user account
    await User.findByIdAndDelete(_id);

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
