import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
 

const prisma = new PrismaClient();

// +page.server.ts

export const load: PageServerLoad = async () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
	const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // Assuming week starts on Monday
	const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 });

	const [products, todaysSales, earlierSales] = await Promise.all([
		prisma.product.findMany({
			where: { stock: { gt: 0 } }
		}),
		prisma.saleBatch.findMany({
            where: {
                date: {
                    gte: yesterday,
                },
            },
            orderBy: { date: 'asc' },
            include: { sales: { include: { product: true } } }
		}),
		prisma.saleBatch.findMany({
            where: {
                date: {
                    gte: startOfCurrentWeek,
                    lte: yesterday,
                },
            },
            orderBy: { date: 'asc' },
            include: { sales: { include: { product: true } } }
		}),
    ]);

	return { products, todaysSales, earlierSales };
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
