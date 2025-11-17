import { Router } from "express";

import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import ExerciseRoutes from "./exercise.routes.js";
import GoalRoutes from "./goal.routes.js";

const router = Router();

router.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    next();
});

router.use("/", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/exercises", ExerciseRoutes);
router.use("/goals", GoalRoutes);

export default router;
