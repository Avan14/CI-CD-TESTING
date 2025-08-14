const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = 3001;

// Add middleware to parse JSON bodies
app.use(express.json());

const client = new MongoClient(
  process.env.MONGO_URL || "mongodb://localhost:27017"
);

// Use underscore for unused parameter to avoid warning
app.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  client
    .connect()
    .then(() => {
      const db = client.db("ci-cd-db");
      const users = db.collection("users");

      return users.insertOne({ username, password });
    })
    .then((result) => {
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertedId,
      });
    })
    .catch((err) => {
      console.error("Error inserting user:", err);
      res.status(500).json({ error: "Internal server error" });
    })
    .finally(() => {
      client.close();
    });
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
