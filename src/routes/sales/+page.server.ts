import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const [products, saleBatches] = await Promise.all([
		prisma.product.findMany({
			where: { stock: { gt: 0 } }
		}),
		prisma.saleBatch.findMany({
            orderBy: [ { date: 'asc' }, ],
            include: { sales: { include: { product: true } } }
		})
    ]);
    
    // console.log(saleBatches)

	return { products, saleBatches };
};

export const actions = {
	createBatch: async ({ request }) => {
		const data = await request.formData();
		const date = new Date(data.get('date')?.toString() || '');
		const description = data.get('description')?.toString() || '';
		const salesData = JSON.parse(data.get('sales')?.toString() || '[]');

        console.log(data, date, description, salesData)

		try {
			const sales = salesData.map(({ productId, quantity, total }: { productId: number, quantity: number, total: number }) => ({
				productId,
				quantity,
				total
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
