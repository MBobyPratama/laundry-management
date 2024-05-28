const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller untuk menambahkan item baru dalam pesanan
const addItem = async (req, res) => {
  const orderId = Number.parseInt(req.params.orderId);
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        name: name,
        price: price,
        orderId: orderId,
      },
    });
    res.json(newItem);
  } catch (error) {
    console.error("Failed to create item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};

// Controller untuk mengupdate item dalam pesanan
const updateItem = async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const updatedItem = await prisma.item.update({
      where: { id: itemId },
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
};

// Controller untuk menghapus item dari pesanan
const deleteItem = async (req, res) => {
  const itemId = Number.parseInt(req.params.itemId);

  try {
    const deletedItem = await prisma.item.delete({
      where: { id: itemId },
    });
    res.json(deletedItem);
  } catch (error) {
    console.error("Failed to delete item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};

module.exports = { addItem, updateItem, deleteItem };
