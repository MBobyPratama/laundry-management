const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const ordersRouter = require("./routes/orderRoutes");
const customersRouter = require("./routes/customerRoutes");
const itemRouter = require("./routes/itemRoutes");

// const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(bodyParser.json());

// Authentication routes
// app.use("/auth", authRoutes);

app.use("/auth", authRoutes);

// Routes
app.use("/orders", ordersRouter);
app.use("/customers", customersRouter);
app.use("/items", itemRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
