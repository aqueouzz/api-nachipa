import express from "express";
import morgan from "morgan";
import upload from "./middlewares/upload.js";

const app = express();

app.use(express.json());
app.use(morgan("tiny"));

// Carpeta estática para ver los archivos subidos
app.use("/uploads", express.static("src/uploads"));

// Importing routes
import authRoutes from "./routes/authRoutes.js";


//importing midedleware

//Route default
app.get("/api-nachipa/v1", (req, res) => {
  res.send("Hello from the server-api Nachipa!");
});

// Routes API
app.use("/api-nachipa/v1/auth", authRoutes);

export default app;
