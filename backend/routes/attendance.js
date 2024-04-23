import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../db-connect.js";

const attendanceRouter = Router();

attendanceRouter.get("/", (req, res) => {
  const queryString = `
    SELECT * FROM Attendance
  `;

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(results);
    }
  });
});

attendanceRouter.get("/:id", (req, res) => {
  const studentId = req.params.id;

  const queryString = `
    SELECT * FROM Attendance
    WHERE student_id = ?
    ORDER BY attendance_date DESC
  `;

  const values = [studentId];

  dbConfig.query(queryString, values, (error, results) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      // Convert 0 or 1 to boolean
      const transformAttendance = (attendance) => {
        return {
          ...attendance,
          is_present: Boolean(attendance.is_present),
        };
      };

      // Modify the results before sending the response
      const transformedResults = results.map(transformAttendance);
      res.json(transformedResults);
    }
  });
});

attendanceRouter.post("/", (req, res) => {
  // Extracting attendance_date and is_present from the request body.
  const { attendance_date, is_present } = req.body;

  // Validate the required fields.
  if (!attendance_date || is_present == null) {
    return res.status(400).json({
      error: "Attendance date and presence status are required",
    });
  }

  // Insert attendance data into the database.
  const query =
    "INSERT INTO Attendance (attendance_date, is_present) VALUES (?, ?)";
  dbConfig.query(query, [attendance_date, is_present], (error, results) => {
    if (error) {
      console.error("Failed to insert attendance data:", error);
      return res.status(500).json({
        error: "Database error during the insertion of attendance data",
      });
    }
    // Respond with success message if the insertion is successful.
    res.status(201).json({ message: "Attendance recorded successfully" });
  });
});

attendanceRouter.put("/:student_id/:attendance_id", (req, res) => {
  const { student_id, attendance_id } = req.params;
  const { class_id, attendance_date, is_present } = req.body;

  const updateQuery = `
    UPDATE Attendance
    SET class_id = ?, attendance_date = ?, is_present = ?
    WHERE student_id = ? AND attendance_id = ?
  `;

  const values = [
    class_id,
    attendance_date,
    is_present,
    student_id,
    attendance_id,
  ];

  dbConfig.query(updateQuery, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
    res.json({ message: "Attendance updated successfully" });
  });
});

attendanceRouter.delete("/:student_id/", (req, res) => {
  const { student_id, attendance_id } = req.params;

  const deleteQuery = `
    DELETE FROM Attendance
    WHERE student_id = ? AND attendance_id = ?
  `;

  const values = [student_id, attendance_id];

  dbConfig.query(deleteQuery, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Attendance record not found" });
    } else {
      res.json({ message: "Attendance record deleted successfully" });
    }
  });
});

export default attendanceRouter;
