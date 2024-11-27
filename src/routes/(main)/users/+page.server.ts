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
    if (locals.user.role != 'ADMIN') {
        redirect(302, '/sales')
    }

    const [users] = await Promise.all([
        prisma.user.findMany({
            where: { superuser: false },
            include: {
                role: true
            }
        })
    ])
    
    return { users }
}