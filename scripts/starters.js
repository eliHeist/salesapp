import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

await prisma.roles.createMany({
    data: [
        { name: "ADMIN" },
        { name: "USER" },
    ],
});