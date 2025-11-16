import auth from "../controllers/auth.controller.js";
import { Router } from "express";
var router = Router();

// Login
router.post("/login", auth.login);

// Authorization
router.post("/authorize", auth.authorize);

// Logout
router.post("/logout", auth.logout);

export default router;
