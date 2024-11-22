import { json, error, redirect } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST({ request, cookies }) {
    const { email, password, csrfToken } = await request.json();

    const storedCsrfToken = cookies.get('csrfToken');

    if (!csrfToken) {
        throw error(403, 'Missing CSRF token.');
    }
    if (csrfToken !== storedCsrfToken) {
        throw error(403, 'Invalid CSRF token.');
    }

    // Clear CSRF token after use
    cookies.delete('csrfToken', { path: '/' });

    if (!email || !password) {
        throw error(400, 'Email and password are required.');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw error(401, 'Invalid email.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw error(401, 'Invalid email or password.');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: '1h',
    });

    // Set the token as a secure, HttpOnly cookie
    cookies.set('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7200, // 2 hours
    });
    console.log(`User ${user.email} logged in`);
    // Redirect to the home page
    throw redirect(303, "/");

    return json({ message: 'Login successful' });
}
