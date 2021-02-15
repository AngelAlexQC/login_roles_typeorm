import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

// Get All Users
router.get("/", UserController.getAll);

// Get One User
router.get("/:id", UserController.findByID);

// Create New User
router.post("/", UserController.create);

// Update User
router.patch("/:ud", UserController.update);

// Delete User
router.delete("/:ud", UserController.delete);

export default router;
