import { PrismaClient } from '@prisma/client';
import readline from 'readline';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askQuestion(query) {
    return new Promise((resolve) => rl.question(query, resolve));
}

async function createSuperUser() {
    try {
        console.log('Creating a superuser...');

        const email = await askQuestion('Email: ');
        if (!email) throw new Error('Email is required.');

        const password = await askQuestion('Password: ');
        if (!password) throw new Error('Password is required.');

        const hashedPassword = await bcrypt.hash(password, 10);

        const username = await askQuestion('Username: ');
        if (!username) throw new Error('Username is required.');

        const fullName = await askQuestion('Full name (optional): ');

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) throw new Error('A user with this email already exists.');

        if (username) {
            const existingUsername = await prisma.user.findUnique({ where: { username } });
            if (existingUsername) throw new Error('This username is already taken.');
        }

        await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                userAuthToken: crypto.randomUUID(),
                username: username || null,
                full_name: fullName || null,
                role: { connect: { name: "ADMIN" } },
            },
        });

        console.log('Superuser created successfully.');
    } catch (error) {
        console.error(`Error: ${error.message}`);
    } finally {
        rl.close();
        await prisma.$disconnect();
    }
}

createSuperUser();
