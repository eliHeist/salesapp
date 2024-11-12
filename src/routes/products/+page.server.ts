import { prisma } from '$lib/server/db';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		orderBy: { createdAt: 'desc' }
	});
	return { products };
};

export const actions = {
	create: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString();
		const sku = data.get('sku')?.toString();
		const price = parseFloat(data.get('price')?.toString() || '0');
		const stock = parseInt(data.get('stock')?.toString() || '0');
		const description = data.get('description')?.toString();

		if (!name || !sku || !price) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			await prisma.product.create({
				data: {
					name,
					sku,
					price,
					stock,
					description
				}
			});
		} catch (error) {
			return fail(500, { error: 'Failed to create product' });
		}
	},

	delete: async ({ request }: { request: Request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id')?.toString() || '0');

		try {
			await prisma.product.delete({
				where: { id }
			});
		} catch (error) {
			return fail(500, { error: 'Failed to delete product' });
		}
	}
} satisfies Actions;