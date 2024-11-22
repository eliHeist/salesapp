import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword } from '$lib/auth';

export const POST: RequestHandler = async ({ request }) => {
    const { email, password, username, firstName, lastName } = await request.json();

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        return json({ error: 'User with this email already exists' }, { status: 400 });
    }

    if (username) {
        const existingUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUsername) {
            return json({ error: 'Username already taken' }, { status: 400 });
        }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
        data: {
            email,
            passwordHash: hashedPassword,
            username: username || null,
            firstName: firstName || null,
            lastName: lastName || null,
        },
    });

    return json({ message: 'User registered successfully', user }, { status: 201 });
};
