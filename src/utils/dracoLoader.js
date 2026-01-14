/**
 * Draco Loader Configuration
 * 
 * Centralized configuration for Draco-compressed GLTF models
 * This enables THREE.js to decompress models that were compressed with gltf-pipeline
 */

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Singleton Draco loader instance
let dracoLoaderInstance = null;
let gltfLoaderInstance = null;

/**
 * Get or create singleton Draco loader instance
 * Uses CDN-hosted Draco decoder for better performance
 * @returns {DRACOLoader} Configured Draco loader
 */
export const getDracoLoader = () => {
    if (!dracoLoaderInstance) {
        dracoLoaderInstance = new DRACOLoader();
        
        // Use jsdelivr CDN for Draco decoder (faster than bundling)
        dracoLoaderInstance.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        
        // Pre-load decoder for faster first model load
        dracoLoaderInstance.preload();
        
        console.log('✅ Draco loader initialized with decoder path');
    }
    
    return dracoLoaderInstance;
};

/**
 * Get or create singleton GLTF loader with Draco support
 * @returns {GLTFLoader} Configured GLTF loader
 */
export const getGLTFLoader = () => {
    if (!gltfLoaderInstance) {
        gltfLoaderInstance = new GLTFLoader();
        gltfLoaderInstance.setDRACOLoader(getDracoLoader());
        console.log('✅ GLTF loader configured with Draco support');
    }
    
    return gltfLoaderInstance;
};

/**
 * Dispose of loader instances (cleanup)
 */
export const disposeLoaders = () => {
    if (dracoLoaderInstance) {
        dracoLoaderInstance.dispose();
        dracoLoaderInstance = null;
    }
    
    gltfLoaderInstance = null;
    console.log('🧹 Draco and GLTF loaders disposed');
};
