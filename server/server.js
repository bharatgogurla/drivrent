import express from "express";
import "dotenv/config";
import cors from "cors";

// Initialize Express App
const app = express()

// Middleware
app.use(cors());
// Parsing
app.use(express.json());

// Route
app.get('/', (req, res)=> res.send("Server is running"))

// Port
const PORT = process.env.PORT || 3000
// Start Express server
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))