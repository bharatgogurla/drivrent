import express from "express";
import { protect, verifyOwner } from "../middlewares/auth.js";
import {
  addCar,
  changeToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middlewares/multer.js";

const ownerRouter = express.Router();

ownerRouter.post("/change-role", protect, changeToOwner);
ownerRouter.post("/add-car", protect, verifyOwner, upload.single("image"), addCar);
ownerRouter.get("/cars", protect, verifyOwner, getOwnerCars);
ownerRouter.post("/toggle-car", protect, verifyOwner, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, verifyOwner, deleteCar);

ownerRouter.get("/dashboard", protect, verifyOwner, getDashboardData);
ownerRouter.post("/update-image", protect, verifyOwner, upload.single("image"), updateUserImage);

export default ownerRouter;