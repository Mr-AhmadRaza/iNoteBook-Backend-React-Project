const express = require("express");
const connectToMongo = require("./db");
const cors = require("cors");
const path = require("path");

connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://i-note-book-react-project.vercel.app" // ✅ YOUR ACTUAL URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "auth-token"],
    credentials: true,
  })
);

app.use(express.json());

// uploads folder public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Backend API is running");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});