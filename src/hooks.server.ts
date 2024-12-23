import type { Handle } from '@sveltejs/kit'
import { db } from '$lib/database'

export const handle: Handle = async ({ event, resolve }) => {
    // get cookies from browser
    const session = event.cookies.get('session')

    if (!session) {
        // if there is no session load page as normal
        return await resolve(event)
    }

    // find the user based on the session
    const user = await db.user.findUnique({
        where: { userAuthToken: session },
        select: { username: true, role: true, full_name: true },
    })

    // if `user` exists set `events.local`
    if (user) {
        event.locals.user = {
            username: user.username,
            full_name: user.full_name,
            role: user.role.name,
        }
    }

    // load page as normal
    return await resolve(event)
}
