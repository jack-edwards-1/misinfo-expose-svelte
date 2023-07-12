import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import adapter from '@sveltejs/adapter-cloudflare';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  kit: {
    adapter: adapter({
        // See below for an explanation of these options
        routes: {
            include: ['/*'],
            exclude: ['<all>']
        }
    })
}
})
