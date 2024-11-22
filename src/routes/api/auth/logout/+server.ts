import { json } from '@sveltejs/kit';

export async function POST({ cookies }) {
    cookies.delete('authToken', { path: '/' });
    return json({ message: 'Logged out successfully' });
}
