import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import { randomInt } from 'node:crypto';

const prisma = new PrismaClient();

type ProductSeed = {
	productId: string;
	name: string;
	category: string;
	description: string;
	stockLevel: number;
	reorderLevel: number;
};

type CSVRow = {
	product_id: string;
	product_name: string;
	category: string;
	units_sold: string;
};

async function fetchAndBuildProducts(): Promise<ProductSeed[]> {
	const res = await fetch(
		'https://raw.githubusercontent.com/Arpit-Raj1/walmart-smart-inventory-management/main/public/40_product_walmart_india_sales_data__3.csv'
	);
	const csv = await res.text();

	const records = parse(csv, {
		columns: true,
		skip_empty_lines: true,
	}) as CSVRow[]; // ✅ Tell TypeScript what each row looks like

	const seen = new Map<string, ProductSeed>();

	for (const row of records) {
		const id = row.product_id;
		if (!seen.has(id)) {
			// const units = parseInt(row.units_sold || '50') || 50;
			const units = randomInt(2000);

			seen.set(id, {
				productId: id,
				name: row.product_name,
				category: row.category,
				description: `Autogenerated description for ${row.product_name}`,
				stockLevel: units,
				reorderLevel: 2 * units,
			});
		}
	}

	return Array.from(seen.values());
}

const seedDatabase = async () => {
	console.log('🌱 Starting dynamic database seeding...');
	console.log('='.repeat(50));

	try {
		// Clear existing data
		console.log('🗑  Clearing existing data...');
		await prisma.inventoryRecord.deleteMany();
		await prisma.prediction.deleteMany();
		await prisma.product.deleteMany();
		console.log('✅ Existing data cleared');

		// Fetch and generate product array
		const products = await fetchAndBuildProducts();
		console.log(`📦 Found ${products.length} unique products`);

		for (const productData of products) {
			await prisma.product.create({
				data: {
					productId: productData.productId,
					name: productData.name,
					category: productData.category,
					description: productData.description,
				},
			});

			await prisma.inventoryRecord.create({
				data: {
					productId: productData.productId,
					stockLevel: productData.stockLevel,
				},
			});

			console.log(`✅ ${productData.productId}: ${productData.name} (Stock: ${productData.stockLevel})`);
		}

		console.log('🎉 Done seeding from CSV data!');
	} catch (err) {
		console.error('❌ Error during seeding:', err);
		throw err;
	} finally {
		await prisma.$disconnect();
	}
};

// Only run if executed directly
if (require.main === module) {
	seedDatabase().catch((err) => process.exit(1));
}

export { seedDatabase };
