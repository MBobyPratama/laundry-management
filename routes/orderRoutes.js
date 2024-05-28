const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route untuk menambahkan pesanan baru
router.post("/", authMiddleware, orderController.addOrder);

// Route untuk mendapatkan daftar pesanan
router.get("/", authMiddleware, orderController.getOrders);

// Route untuk mengupdate pesanan
router.put("/:id", authMiddleware, orderController.updateOrder);

// Route untuk menghapus pesanan
router.delete("/:id", authMiddleware, orderController.deleteOrder);

module.exports = router;
