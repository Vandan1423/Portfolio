import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // Brotli compression (better than gzip, 65% reduction)
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 10240, // Only compress files > 10KB
        }),
        // Gzip compression fallback for older browsers
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 10240,
        }),
        // Bundle analyzer - visualize chunk sizes
        visualizer({
            open: false, // Set to true to auto-open in browser
            gzipSize: true,
            brotliSize: true,
            filename: 'dist/stats.html', // Will be in dist folder
        }),
    ],
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
        // Prevent inlining of models and large assets as base64
        assetsInlineLimit: 0, // Never inline assets (keep as separate files for caching)
        chunkSizeWarningLimit: 1000, // Increased to 1000KB for 3D chunks
        // Optimize CSS code splitting
        cssCodeSplit: true,
        // Minify with terser for better compression
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true, // Remove debugger statements
                pure_funcs: ['console.log', 'console.info'], // Remove specific console methods
            },
        },
        // Disable source maps for smaller build (enable for debugging)
        sourcemap: false,
        // Optimize asset output
        assetsDir: 'assets', // Organize assets in dedicated folder
    },
});
