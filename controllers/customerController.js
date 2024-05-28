const { PrismaClient } = require("@prisma/client");
const { isValidEmail, isValidPhone } = require("../validators/validators"); // Adjust the path accordingly
const prisma = new PrismaClient();

// Controller untuk menambahkan pelanggan baru
const addCustomer = async (req, res) => {
	const { name, email, phone } = req.body;
	// Validate email and phone
	if (!isValidEmail(email)) {
		return res.status(400).json({ error: "Invalid email address" });
	}
	if (!isValidPhone(phone)) {
		return res.status(400).json({ error: "Invalid phone number" });
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
};

// Controller untuk mendapatkan daftar pelanggan
const getCustomers = async (req, res) => {
	try {
		const customers = await prisma.customer.findMany();
		res.json(customers);
	} catch (error) {
		console.error("Failed to fetch customers:", error);
		res.status(500).json({ error: "Failed to fetch customers" });
	}
};

// Controller untuk mengupdate pelanggan
const updateCustomer = async (req, res) => {
	const customerId = Number.parseInt(req.params.id);
	const { name, email, phone } = req.body;
	try {
		const updatedCustomer = await prisma.customer.update({
			where: { id: customerId },
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
};

// Controller untuk menghapus pelanggan
const deleteCustomer = async (req, res) => {
	const customerId = Number.parseInt(req.params.id);
	try {
		const deletedCustomer = await prisma.customer.delete({
			where: { id: customerId },
		});
		res.json(deletedCustomer);
	} catch (error) {
		console.error("Failed to delete customer:", error);
		res.status(500).json({ error: "Failed to delete customer" });
	}
};

module.exports = { addCustomer, getCustomers, updateCustomer, deleteCustomer };
