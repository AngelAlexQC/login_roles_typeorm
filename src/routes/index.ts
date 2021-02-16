import { Router } from "express";
import AuthController from "../controller/AuthController";
import auth from "./auth";
import user from "./user";

const routes = Router();
routes.use("/auth", auth);
routes.use("/users", user);
// Profile
routes.get("/profile", AuthController.profile);

export default routes;
