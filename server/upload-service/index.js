const express = require("express");
const app = express();
const imageRoutes = require("./routes/imageRoutes");
const { PORT } = require("./config/env");

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/images", imageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
