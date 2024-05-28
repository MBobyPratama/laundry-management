const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	// Tambahkan data customer
	const customer1 = await prisma.customer.upsert({
		where: { email: "john@example.com" }, // Ubah email sesuai dengan email yang ingin di-update atau di-insert
		update: {}, // Kosongkan jika Anda tidak ingin mengupdate data yang sudah ada
		create: {
			name: "John Doe",
			email: "john@example.com",
			phone: "123456789",
			orders: {
				create: [
					{
						date: new Date(),
						items: {
							create: [
								{ name: "Item 1", price: 10.0 },
								{ name: "Item 2", price: 15.0 },
							],
						},
					},
					{
						date: new Date(),
						items: {
							create: [{ name: "Item 3", price: 20.0 }],
						},
					},
				],
			},
		},
		include: {
			orders: {
				include: {
					items: true,
				},
			},
		},
	});

	console.log("Created customer:", customer1);

	// Tambahkan data customer lainnya
	const customer2 = await prisma.customer.upsert({
		where: { email: "jane@example.com" }, // Ubah email sesuai dengan email yang ingin di-update atau di-insert
		update: {}, // Kosongkan jika Anda tidak ingin mengupdate data yang sudah ada
		create: {
			name: "Jane Smith",
			email: "jane@example.com",
			phone: "987654321",
			orders: {
				create: [
					{
						date: new Date(),
						items: {
							create: [{ name: "Item 4", price: 25.0 }],
						},
					},
				],
			},
		},
		include: {
			orders: {
				include: {
					items: true,
				},
			},
		},
	});

	console.log("Created customer:", customer2);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
