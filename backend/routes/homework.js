import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../db-connect.js";

const homeworkRouter = Router();

// Fetch all homework assignments
homeworkRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Homework";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching homework assignments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific homework assignment by ID
homeworkRouter.get("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const queryString = "SELECT * FROM Homework WHERE homework_id = ?";
  dbConfig.query(queryString, [homeworkId], (error, results) => {
    if (error) {
      console.error("Error fetching homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json(results[0]); // Return the first and only homework assignment in the array
    }
  });
});

// Create a new homework assignment
homeworkRouter.post("/", (req, res) => {
  const { firstname, course_name, assignment_name, description, due_date } =
    req.body;

  // Check if all required fields are provided
  if (
    !firstname ||
    !course_name ||
    !assignment_name ||
    !description ||
    !due_date
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Query the database to get the course_id based on the provided course_name
  const courseQuery = "SELECT course_id FROM Courses WHERE course_name = ?";
  dbConfig.query(courseQuery, [course_name], (courseError, courseResults) => {
    if (courseError) {
      console.error("Error fetching course ID:", courseError);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (courseResults.length === 0) {
      return res.status(404).json({ error: "Course not found" });
    }

    const course_id = courseResults[0].course_id;

    // Check if the student exists
    const studentQuery = "SELECT student_id FROM Students WHERE firstname = ?";
    dbConfig.query(
      studentQuery,
      [firstname],
      (studentError, studentResults) => {
        if (studentError) {
          console.error("Error fetching student ID:", studentError);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        let student_id;

        // If the student doesn't exist, create a new student
        if (studentResults.length === 0) {
          const insertStudentQuery =
            "INSERT INTO Students (firstname) VALUES (?)";
          dbConfig.query(
            insertStudentQuery,
            [firstname],
            (insertError, insertResult) => {
              if (insertError) {
                console.error("Error creating a new student:", insertError);
                return res.status(500).json({ error: "Internal Server Error" });
              }
              // Retrieve the newly created student's ID
              student_id = insertResult.insertId;
              // Insert the homework assignment with the retrieved student_id and course_id
              insertHomework(
                student_id,
                course_id,
                assignment_name,
                description,
                due_date,
                res
              );
            }
          );
        } else {
          // If the student exists, use their ID to insert the homework assignment
          student_id = studentResults[0].student_id;
          insertHomework(
            student_id,
            course_id,
            assignment_name,
            description,
            due_date,
            res
          );
        }
      }
    );
  });
});

// Function to insert homework assignment into the database
function insertHomework(
  student_id,
  course_id,
  assignment_name,
  description,
  due_date,
  res
) {
  const insertQuery =
    "INSERT INTO Homework (course_id, student_id, assignment_name, description, due_date) VALUES (?, ?, ?, ?, ?)";
  dbConfig.query(
    insertQuery,
    [course_id, student_id, assignment_name, description, due_date],
    (error, result) => {
      if (error) {
        console.error("Error creating a new homework assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({
          message: "Homework assignment created successfully",
          id: result.insertId,
        });
      }
    }
  );
}

// Update an existing homework assignment
homeworkRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { student_id, assignment_name, description, due_date } = req.body;

  // Check if all required fields are provided
  if (!student_id || !assignment_name || !description || !due_date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Update the homework assignment in the database
  const updateQuery =
    "UPDATE Homework SET student_id = ?, assignment_name = ?, description = ?, due_date = ? WHERE homework_id = ?";
  dbConfig.query(
    updateQuery,
    [student_id, assignment_name, description, due_date, id],
    (error, result) => {
      if (error) {
        console.error("Error updating homework assignment:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Homework assignment not found" });
      } else {
        res.json({ message: "Homework assignment updated successfully" });
      }
    }
  );
});

// Delete a homework assignment
homeworkRouter.delete("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const deleteQuery = "DELETE FROM Homework WHERE homework_id = ?";
  dbConfig.query(deleteQuery, [homeworkId], (error, result) => {
    if (error) {
      console.error("Error deleting homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json({ message: "Homework assignment deleted successfully" });
    }
  });
});

export default homeworkRouter;
