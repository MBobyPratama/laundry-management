const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const validateData = require("../middlewares/validationMiddlewares");
const authMiddleware = require("../middlewares/authMiddleware");

// Route untuk menambahkan pelanggan baru
router.post("/", validateData, authMiddleware, customerController.addCustomer);

// Route untuk mendapatkan daftar pelanggan
router.get("/", authMiddleware, customerController.getCustomers);

// Route untuk mengupdate pelanggan
router.put("/:id", authMiddleware, customerController.updateCustomer);

// Route untuk menghapus pelanggan
router.delete("/:id", authMiddleware, customerController.deleteCustomer);

module.exports = router;
