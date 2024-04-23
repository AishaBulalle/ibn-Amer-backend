import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRouter from "./routes/auth/index.js";
import studentsRouter from "./Routes/students.js";
import teachersRouter from "./Routes/teachers.js";
import attendanceRouter from "./Routes/attendance.js";
import QuranProgressRouter from "./Routes/QuranProgress.js";
import homeworkRouter from "./Routes/homework.js";
import coursesRouter from "./Routes/courses.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import studentClassesRouter from "./routes/studentClasses.js";

import {
  loginUser,
  registerUser,
  logoutUser,
} from "./controllers/authController.js";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "./controllers/studentsController.js";

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherById,
  deleteTeacherById,
} from "./controllers/teachersController.js";

import {
  getAllQuranProgress,
  getQuranProgressById,
  createQuranProgress,
  updateQuranProgressById,
  deleteQuranProgressById,
} from "./controllers/quranProgressController.js";

import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "./controllers/coursesController.js";

import {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
} from "./controllers/attendanceController.js";

const app = express();
const port = 3500;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
  })
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use("/auth/", apiLimiter); // Applying rate limit to auth routes

app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/teachers", teachersRouter);
app.use("/attendance", attendanceRouter);
app.use("/quranProgress", QuranProgressRouter);
app.use("/homework", homeworkRouter);
app.use("/courses", coursesRouter);
app.use("/users", usersRouter);
app.use("/classes", classesRouter);
app.use("/studentClasses", studentClassesRouter);

// Route for user logout
authRouter.post("/logout", logoutUser);
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Define student routes
studentsRouter.get("/", getAllStudents);
studentsRouter.get("/:id", getStudentById);
studentsRouter.post("/", createStudent);
studentsRouter.put("/:id", updateStudentById);
studentsRouter.delete("/:id", deleteStudentById);

// Define teacher routes
teachersRouter.get("/", getAllTeachers);
teachersRouter.get("/:id", getTeacherById);
teachersRouter.post("/", createTeacher);
teachersRouter.put("/:id", updateTeacherById);
teachersRouter.delete("/:id", deleteTeacherById);

// Define Quran progress routes
QuranProgressRouter.get("/", getAllQuranProgress);
QuranProgressRouter.get("/:id", getQuranProgressById);
QuranProgressRouter.post("/", createQuranProgress);
QuranProgressRouter.put("/:id", updateQuranProgressById);
QuranProgressRouter.delete("/:id", deleteQuranProgressById);

// Define course routes
coursesRouter.get("/", getAllCourses);
coursesRouter.get("/:id", getCourseById);
coursesRouter.post("/", createCourse);
coursesRouter.put("/:id", updateCourseById);
coursesRouter.delete("/:id", deleteCourseById);

// Define attendance routes
attendanceRouter.get("/", getAllAttendances);
attendanceRouter.get("/:id", getAttendanceById);
attendanceRouter.post("/", createAttendance);
attendanceRouter.put("/:id", updateAttendanceById);
attendanceRouter.delete("/:id", deleteAttendanceById);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Route for root endpoint
app.get("/", (req, res) => {
  res.send("Hello, this is the backend.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
