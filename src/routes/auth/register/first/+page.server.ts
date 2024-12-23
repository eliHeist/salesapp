import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcrypt'

import { db } from '$lib/database'

// using an enum for user roles to avoid typos
// if you're not using TypeScript use an object
enum Roles {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export const load = async ({ locals }) => {
    // redirect user if logged in
    const users = await db.user.count()
    if (users > 0) {
        redirect(302, '/auth/login')
    }
}

const register = async ({ request }) => {
    const data = await request.formData()
    const username = data.get('username')
    const password = data.get('password')
    const email = data.get('email')
    const full_name = data.get('full_name')

    if (
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        !username ||
        !password
    ) {
        return fail(400, { invalid: true })
    }

    const user = await db.user.findUnique({
        where: { username },
    })

    if (user) {
        return fail(400, { user: true })
    }

    await db.user.create({
        data: {
            username,
            full_name,
            email,
            superuser: true,
            passwordHash: await bcrypt.hash(password, 10),
            userAuthToken: crypto.randomUUID(),
            role: { connect: { name: Roles.ADMIN } },
        },
    })

    redirect(303, '/auth/login')
}

export const actions = { register }
