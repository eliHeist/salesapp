import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const prisma = new PrismaClient();

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
        const price = parseFloat(data.get('price')?.toString() || '0');
        const stock = parseInt(data.get('stock')?.toString() || '0');
        const description = data.get('description')?.toString();

        if (!name || !price) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            await prisma.product.create({
                data: {
                    name,
                    price,
                    stock,
                    description
                }
            });
        } catch (error) {
            return fail(500, { error: 'Failed to create product' });
        }
    },

    stock: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const id = parseInt(data.get('id')?.toString() || '0');
        const quantity = parseInt(data.get('quantity')?.toString() || '0');

        if (!id || !quantity) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            const product = await prisma.product.findUnique({
                where: { id }
            });

            if (!product) {
                return fail(404, { error: 'Product not found' });
            }

            await prisma.product.update({
                where: { id },
                data: {
                    stock: product.stock + quantity
                }
            });
        } catch (error) {
            return fail(500, {
                error: 'Failed to update product stock'
            })
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