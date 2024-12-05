import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, locals }) => {
    // redirect user if not logged in
    if (!locals.user) {
        return json({ error: 'Not authenticated' }, { status: 400 })
    }

    try {
        const data = await request.json();
        const { name, price, stock, description } = data;

        if (!name) {
            return json({ error: 'Name is required' }, { status: 400 });
        }
        if (price === undefined || isNaN(price)) {
            return json({ error: 'Price is required and must be a number' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                price: parseFloat(price),
                stock: parseInt(stock, 10) || 0,
                description
            }
        });

        return json({ success: 'Product created successfully', product: product }, { status: 200 });
    } catch (error) {
        return json({ error: 'Failed to create product' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request }) => {
    try {
        const data = await request.json();
        const id = parseInt(data.id?.toString() || '0');

        if (!id) {
            return json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await prisma.product.delete(
            { where: { id } }
        );
        
        return json(
            { success: 'Product deleted successfully' },
            { status: 200 }
        );
    }
    catch (error) {
        console.error('Error:', error);
        return json(
            {
                error: 'Failed to delete product',
                error_message: error
            },
            { status: 500 }
        );
    }
};
