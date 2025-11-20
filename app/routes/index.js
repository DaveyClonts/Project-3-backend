import { Router } from "express";

import AuthRoutes from "./auth.routes.js";
import UserRoutes from "./user.routes.js";
import ExerciseRoutes from "./exercise.routes.js";
import GoalRoutes from "./goal.routes.js";
import NoteRoutes from "./note.routes.js";
import WorkoutRoutes from "./workout.routes.js";
import WorkoutExerciseRoutes from "./workoutExercise.routes.js";

const router = Router();

router.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
    console.log("router received request " + req.url);

    next();
});

router.use("/", AuthRoutes);
router.use("/users", UserRoutes);
router.use("/exercises", ExerciseRoutes);
router.use("/goals", GoalRoutes);
router.use("/notes", NoteRoutes);
router.use("/workouts", WorkoutRoutes);
router.use("/workoutExercises", WorkoutExerciseRoutes);

export default router;
