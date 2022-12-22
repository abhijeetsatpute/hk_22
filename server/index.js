const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("HTTP Method: " + req.method + " , URL: " + req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

// Express Error handling middleware
app.use((error, req, res, next) => {
  // console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URI)
  .then((result) => {
    console.log("🎉 Database connected.");
    app.listen(process.env.PORT, function () {
      console.log("✨ App listening on port", this.address().port);
    });
  })
  .catch((err) => {
    // console.log(err);
  });
