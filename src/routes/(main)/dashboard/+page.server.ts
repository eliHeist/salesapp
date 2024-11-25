import { redirect } from '@sveltejs/kit'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = async ({ locals }) => {
    // redirect user if not logged in
    if (!locals.user) {
        redirect(302, '/auth/login')
    }

    // get products
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });
    // get last 10 sales
    const sales = await prisma.saleBatch.findMany({
        orderBy: { createdAt: 'desc' },
    })
    // get users count
    const users = await prisma.user.count();

    const recentItems = await prisma.sale.findMany({
        take: 10
    })

    return { products, sales, users, recentItems };
}
