require("dotenv").config();
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const app = express(); // Inisialisasi server Express

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());

// Middleware for error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Middleware to check JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token not provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token is not valid" });
    req.user = user;
    next();
  });
};

// Endpoint untuk membuat pesanan baru
app.post("/orders", authenticateToken, async (req, res) => {
  const { customerId, item } = req.body;
  if (!customerId || !item || !item.name || !item.price) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const order = await prisma.order.create({
      data: {
        date: new Date(),
        customerId: customerId,
        items: {
          create: {
            name: item.name,
            price: item.price,
          },
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });
    res.json(order);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Endpoint untuk mendapatkan daftar pesanan
app.get("/orders", authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        customer: true,
      },
    });
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Endpoint untuk mengupdate pesanan
app.put("/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { customerId, item } = req.body;
  if (!customerId || !item || !item.name || !item.price) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number.parseInt(id) },
      data: {
        customerId: customerId,
        items: {
          update: {
            where: { id: item.id },
            data: {
              name: item.name,
              price: item.price,
            },
          },
        },
      },
      include: {
        items: true,
        customer: true,
      },
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Endpoint untuk menghapus pesanan
app.delete("/orders/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: Number.parseInt(id) },
    });
    res.json(deletedOrder);
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// Endpoint untuk membuat item baru dalam pesanan
app.post("/orders/:orderId/items", authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        name: name,
        price: price,
        orderId: Number.parseInt(orderId),
      },
    });
    res.json(newItem);
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

// Endpoint untuk mengupdate item dalam pesanan
app.put(
  "/orders/:orderId/items/:itemId",
  authenticateToken,
  async (req, res) => {
    const { orderId, itemId } = req.params;
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    try {
      const updatedItem = await prisma.item.update({
        where: { id: Number.parseInt(itemId) },
        data: {
          name: name,
          price: price,
        },
      });
      res.json(updatedItem);
    } catch (error) {
      console.error("Failed to update item:", error);
      res.status(500).json({ error: "Failed to update item" });
    }
  }
);

// Endpoint untuk menghapus item dari pesanan
app.delete(
  "/orders/:orderId/items/:itemId",
  authenticateToken,
  async (req, res) => {
    const { orderId, itemId } = req.params;

    try {
      const deletedItem = await prisma.item.delete({
        where: { id: Number.parseInt(itemId) },
      });
      res.json(deletedItem);
    } catch (error) {
      console.error("Failed to delete item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  }
);

// Endpoint untuk membuat pelanggan baru
app.post("/customers", authenticateToken, async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name: name,
        email: email,
        phone: phone,
      },
    });
    res.json(newCustomer);
  } catch (error) {
    console.error("Failed to create customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

// Endpoint untuk mendapatkan daftar pelanggan
app.get("/customers", authenticateToken, async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// Endpoint untuk mengupdate pelanggan
app.put("/customers/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id: Number.parseInt(id) },
      data: {
        name: name,
        email: email,
        phone: phone,
      },
    });
    res.json(updatedCustomer);
  } catch (error) {
    console.error("Failed to update customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// Endpoint untuk menghapus pelanggan
app.delete("/customers/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCustomer = await prisma.customer.delete({
      where: { id: Number.parseInt(id) },
    });
    res.json(deletedCustomer);
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
