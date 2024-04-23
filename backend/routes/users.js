import { Router } from "express";
import dbConfig from "../db-connect.js";
import mysql from "mysql2";

const usersRouter = Router();

// Fetch all users
usersRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Users ORDER BY username;";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific user by user_id
usersRouter.get("/:id", (req, res) => {
  const userId = req.params.id;
  const queryString = "SELECT * FROM Users WHERE user_id = ?;";
  dbConfig.query(queryString, [userId], (error, results) => {
    if (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(results[0]);
    }
  });
});

// Create a new user
usersRouter.post("/", (req, res) => {
  const { username, password_hash, role } = req.body;
  if (!username || !password_hash || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required." });
  }

  const insertQuery =
    "INSERT INTO Users (username, password_hash, role) VALUES (?, ?, ?)";
  dbConfig.query(insertQuery, [username, password_hash, role], (err, data) => {
    if (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res
        .status(201)
        .json({ message: "User created successfully", user_id: data.insertId });
    }
  });
});

// Update an existing user
usersRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { username, password_hash, role } = req.body;
  if (!username || !password_hash || !role) {
    return res
      .status(400)
      .json({ error: "Username, password, and role are required." });
  }

  const updateQuery =
    "UPDATE Users SET username = ?, password_hash = ?, role = ? WHERE user_id = ?";
  dbConfig.query(
    updateQuery,
    [username, password_hash, role, id],
    (err, data) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (data.affectedRows === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json({ message: "User updated successfully" });
      }
    }
  );
});

// Delete a user
usersRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM Users WHERE user_id = ?";
  dbConfig.query(deleteQuery, [id], (err, data) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (data.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

export default usersRouter;
