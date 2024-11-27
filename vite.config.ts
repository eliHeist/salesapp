import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import sass from 'sass';

export default defineConfig({
    plugins: [sveltekit()],
    css: {
        preprocessorOptions: {
            scss: {
                implementation: sass,
            },
        },
    },
});
