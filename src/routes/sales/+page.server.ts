import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const [sales, products, saleBatches] = await Promise.all([
		prisma.sale.findMany({
			include: { product: true, batch: true },
		}),
		prisma.product.findMany({
			where: { stock: { gt: 0 } }
		}),
		prisma.saleBatch.findMany({
			include: { sales: { include: { product: true } } }
		})
	]);

	return { sales, products, saleBatches };
};

export const actions = {
	createBatch: async ({ request }) => {
		const data = await request.formData();
		const date = new Date(data.get('date')?.toString() || '');
		const description = data.get('description')?.toString() || '';
		const salesData = JSON.parse(data.get('sales')?.toString() || '[]');

		try {
			const sales = salesData.map(({ productId, quantity }: { productId: number, quantity: number }) => ({
				productId,
				quantity,
				total: 0 // Will calculate based on product price
			}));

			const batch = await prisma.saleBatch.create({
				data: {
					date,
					description,
					sales: {
						create: sales
					}
				},
				include: { sales: true }
			});

			// Update stock for each sale and calculate total
			await Promise.all(
				batch.sales.map(async sale => {
					const product = await prisma.product.findUnique({ where: { id: sale.productId } });
					if (product) {
						const total = product.price * sale.quantity;
						await prisma.product.update({
							where: { id: product.id },
							data: { stock: { decrement: sale.quantity } }
						});
						await prisma.sale.update({
							where: { id: sale.id },
							data: { total }
						});
					}
				})
			);
		} catch (error) {
			return fail(500, { error: 'Failed to create batch' });
		}
	},
	// Add similar actions for `updateBatch`, `deleteBatch`, `updateSale`, and `deleteSale` if needed.
} satisfies Actions;
