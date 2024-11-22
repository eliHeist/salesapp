import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { hashPassword, verifyToken } from '$lib/auth';

export const POST: RequestHandler = async ({ request }) => {
  const { token, newPassword } = await request.json();

  const decoded = verifyToken(token);
  if (!decoded) {
    return json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id, resetToken: token } });
  if (!user || user.resetTokenExpiry === null || user.resetTokenExpiry < new Date()) {
    return json({ error: 'Invalid or expired token' }, { status: 400 });
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: hashedPassword, resetToken: null, resetTokenExpiry: null },
  });

  return json({ message: 'Password updated successfully' }, { status: 200 });
};
