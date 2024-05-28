const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route untuk menambahkan item baru dalam pesanan
router.post("/:orderId/items", authMiddleware, itemController.addItem);

// Route untuk mengupdate item dalam pesanan
router.put(
  "/:orderId/items/:itemId",
  authMiddleware,
  itemController.updateItem
);

// Route untuk menghapus item dari pesanan
router.delete(
  "/:orderId/items/:itemId",
  authMiddleware,
  itemController.deleteItem
);

module.exports = router;
