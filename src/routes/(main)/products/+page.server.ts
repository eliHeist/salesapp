import { PrismaClient } from '@prisma/client';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit'

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ locals }) => {
    // redirect user if not logged in
    if (!locals.user) {
        redirect(302, '/auth/login')
    }

    const user = locals.user

    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    
    async function getProductWithMostSales() {
        // Step 1: Get the product ID with the most sales 
        const mostSales = await prisma.sale.groupBy({
            by: ['productId'],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: 'desc' } },
            take: 1
        });
        
        if (mostSales.length === 0) return null;
        const productId = mostSales[0].productId;
        
        // Step 2: Fetch the corresponding product 
        const productWithMostSales = await prisma.product.findUnique({
            where: { id: productId },
            include: { sales: true }
        });

        return productWithMostSales
    }

    const productWithMostSales = await getProductWithMostSales()

    // Get the product with the most stock
    const productWithMostStock = await prisma.product.findFirst({
        orderBy: {
            stock: 'desc'
        }
    });

    // Get products that are out of stock
    const productsOutOfStock = await prisma.product.findMany({
        where: {
            stock: 0
        }
    });

    
    return { products, productWithMostStock, productsOutOfStock, productWithMostSales, user };
};

export const actions = {

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