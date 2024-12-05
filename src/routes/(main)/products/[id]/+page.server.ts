import { PrismaClient } from '@prisma/client';
import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit'

const prisma = new PrismaClient();

let pk: number | null = null

export const load: PageServerLoad = async ({ locals, params }) => {
    // redirect user if not logged in
    if (!locals.user) {
        redirect(302, '/auth/login')
    }
    
    let user = locals.user

    const { id } = params;

    pk = id

    const product = await prisma.product.findUnique({
        where: { id: Number(id) },
        include: { sales: true }
    })

    if (!product) {
        throw error(404, "Product not found")
    }
    
    return { product, user };
};

export const actions = {
    update: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const name = data.get('name')?.toString();
        const price = parseFloat(data.get('price')?.toString() || '0');
        const stock = parseInt(data.get('stock')?.toString() || '0');
        const description = data.get('description')?.toString();
        const id = data.get('id')

        if (!name || !price || !id) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            await prisma.product.update({
                where: {
                    id: Number(id)
                },
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

        console.log("Deleting pdt ", id)

        try {
            await prisma.product.delete({
                where: { id }
            });
            console.log("deleted")
            throw redirect(302, '/products')
        } catch (error) {
            console.log(error)
            return fail(500, { error: 'Failed to delete product' });
        }
    }
} satisfies Actions;