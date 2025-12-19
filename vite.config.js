import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split React and React DOM into separate chunk
                    'react-vendor': ['react', 'react-dom'],

                    // Split Three.js and related libraries into separate chunk
                    'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],

                    // Split Framer Motion into separate chunk
                    'framer-vendor': ['framer-motion'],

                    // Split Redux into separate chunk
                    'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        // Optimize CSS code splitting
        cssCodeSplit: true,
        // Minify with esbuild for better performance
        minify: 'esbuild',
        // Enable source maps for debugging (optional, can disable for smaller build)
        sourcemap: false,
    },
});
