const WebSocket = require("ws");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("Client connected");
  const client = new MongoClient(
    process.env.MONGO_URL || "mongodb://localhost:27017"
  );

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);
    client
      .connect()
      .then(() => {
        const db = client.db("ci-cd-db");
        const users = db.collection("users");

        ws.on("message", async (message) => {
          console.log(`Received: ${message}`);
          const result = await users.insertOne({
            username: `web-socket-user-${Math.random().toFixed(3).toString()}`,
            password: "password123",
          });
          ws.send(
            JSON.stringify({
              message: "User created successfully",
            })
          );
        });
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err);
        ws.send(JSON.stringify({ error: "Database connection failed" }));
      });
    ws.send(`Server received: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
