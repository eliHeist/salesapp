import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [sales, products] = await Promise.all([
		prisma.sale.findMany({
			include: { product: true },
			orderBy: { createdAt: 'desc' }
		}),
		prisma.product.findMany({
			where: { stock: { gt: 0 } }
		})
	]);

	return { sales, products };
};

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const productId = parseInt(data.get('productId')?.toString() || '0');
		const quantity = parseInt(data.get('quantity')?.toString() || '0');

		if (!productId || !quantity) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const product = await prisma.product.findUnique({
				where: { id: productId }
			});

			if (!product) {
				return fail(404, { error: 'Product not found' });
			}

			if (product.stock < quantity) {
				return fail(400, { error: 'Insufficient stock' });
			}

			const total = product.price * quantity;

			await prisma.$transaction([
				prisma.sale.create({
					data: {
						productId,
						quantity,
						total
					}
				}),
				prisma.product.update({
					where: { id: productId },
					data: { stock: { decrement: quantity } }
				})
			]);
		} catch (error) {
			return fail(500, { error: 'Failed to create sale' });
		}
	}
} satisfies Actions;