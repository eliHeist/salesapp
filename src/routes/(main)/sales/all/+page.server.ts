import { PrismaClient } from '@prisma/client';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
 

const prisma = new PrismaClient();

// +page.server.ts

export const load: PageServerLoad = async ({ locals }) => {
    // redirect user if not logged in
    if (!locals.user) {
        redirect(302, '/auth/login')
    }

    const [products, sales] = await Promise.all([
        prisma.product.findMany({
            where: { stock: { gt: 0 } }
        }),
        prisma.saleBatch.findMany({
            orderBy: { date: 'asc' },
            include: { sales: { include: { product: true } } }
        }),
    ]);

    return { products, sales };
};

