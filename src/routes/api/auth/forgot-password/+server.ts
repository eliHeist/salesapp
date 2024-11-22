import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { generateToken } from '$lib/auth';
import { addHours } from 'date-fns';

export const POST: RequestHandler = async ({ request }) => {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return json({ error: 'User not found' }, { status: 404 });
  }

  const resetToken = generateToken({ id: user.id });
  const expiry = addHours(new Date(), 1);

  await prisma.user.update({
    where: { email },
    data: { resetToken, resetTokenExpiry: expiry },
  });

  console.log(`Password reset token for ${email}: ${resetToken}`);

  return json({ message: 'Reset token generated' }, { status: 200 });
};
