const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Controller untuk menambahkan pesanan baru
const addOrder = async (req, res) => {
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
};

// Controller untuk mendapatkan daftar pesanan
const getOrders = async (req, res) => {
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
};

// Controller untuk mengupdate pesanan
const updateOrder = async (req, res) => {
	const orderId = Number.parseInt(req.params.id);
	const { customerId, item } = req.body;
	if (!customerId || !item || !item.name || !item.price) {
		return res.status(400).json({ error: "Invalid request body" });
	}

	try {
		const updatedOrder = await prisma.order.update({
			where: { id: orderId },
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
};

// Controller untuk menghapus pesanan
const deleteOrder = async (req, res) => {
	const orderId = Number.parseInt(req.params.id);
	try {
		const deletedOrder = await prisma.order.delete({
			where: { id: orderId },
		});
		res.json(deletedOrder);
	} catch (error) {
		console.error("Failed to delete order:", error);
		res.status(500).json({ error: "Failed to delete order" });
	}
};

module.exports = { addOrder, getOrders, updateOrder, deleteOrder };
