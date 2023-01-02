import { defineConfig } from 'vite';
import eslint from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';

const PWAConfig = {
	includeAssets: ['favicon.ico', 'robots.txt'],
	manifest: {
		short_name: 'Smart Shopping List',
		name: 'TCL Smart Shopping List',
		description:
			"A smart shopping list that learns your purchase habits and makes suggestions, so you don't forget to buy what's important.",
		icons: [
			{
				src: 'favicon.ico',
				sizes: '64x64 32x32 24x24 16x16',
				type: 'image/x-icon',
			},
			{
				src: 'logo192.png',
				type: 'image/png',
				sizes: '192x192',
			},
			{
				src: 'logo512.png',
				type: 'image/png',
				sizes: '512x512',
			},
		],
		start_url: '.',
		display: 'standalone',
		theme_color: '#000000',
		background_color: '#ffffff',
	},
};

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		outDir: './build',
		target: 'esnext',
		commonjsOptions: { include: [] },
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes('node_modules')) {
						if (id.includes('react')) {
							return 'vendor__react';
						}
						if (id.includes('firebase')) {
							return 'vendor__firebase';
						}
						return 'vendor';
					}
				},
			},
		},
	},
	optimizeDeps: { disabled: false },
	plugins: [
		eslint({ cache: false, formatter: 'stylish' }),
		react(),
		svgr({ exportAsDefault: true }),
		VitePWA(PWAConfig),
	],
	server: { open: true, port: 3000 },
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './tests/setup.js',
	},
});
