// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces


declare global {
    namespace App {
        interface Locals {
            user: {
                username: string
                full_name: string
                role: string
            }
        }
    }
}

export { };
