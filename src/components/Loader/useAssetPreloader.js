/**
 * useAssetPreloader Hook
 *
 * Custom React hook for preloading all portfolio assets with progress tracking.
 * Handles images, textures, and 3D models with concurrent loading limits.
 *
 * Features:
 * - Concurrent loading with configurable batch size
 * - Progress tracking with callbacks
 * - Error handling (continues on failure)
 * - Support for multiple asset types
 */

import { useState, useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { getAssetsInPriorityOrder } from '../../utils/assetCollector';
import * as THREE from 'three';

// Maximum number of assets to load concurrently
const CONCURRENT_LOAD_LIMIT = 5;
// Max time before we bail out and render the app anyway (ms)
const FALLBACK_COMPLETE_MS = 12000;
// Only these priorities block initial render
const CRITICAL_PRIORITIES = new Set(['high', 'medium']);

/**
 * Preload a texture using THREE.js TextureLoader
 * This ensures textures are cached properly for THREE.js components
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when texture is loaded
 */
const preloadTexture = (asset) => {
    return new Promise((resolve) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            asset.url,
            (texture) => {
                // Texture loaded successfully and cached in THREE.js
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve({ success: true, asset });
            },
            undefined,
            () => {
                resolve({ success: false, asset });
            }
        );
    });
};

/**
 * Preload a single image (for HTML/CSS use, not THREE.js)
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when image is loaded
 */
const preloadImage = (asset) => {
    return new Promise((resolve) => {
        const img = new Image();

        // Enable CORS for Cloudinary images
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            resolve({ success: true, asset });
        };

        img.onerror = () => {
            resolve({ success: false, asset }); // Resolve anyway to continue
        };

        img.src = asset.url;
    });
};

/**
 * Preload a single 3D model
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when model is preloaded
 */
const preloadModel = (asset) => {
    return new Promise((resolve) => {
        try {
            // Use useGLTF.preload from @react-three/drei
            useGLTF.preload(asset.url);
            resolve({ success: true, asset });
        } catch {
            resolve({ success: false, asset }); // Resolve anyway to continue
        }
    });
};

/**
 * Preload an asset based on its type
 * @param {Object} asset - Asset object with type, url, and name
 * @returns {Promise} Resolves when asset is loaded
 */
const preloadAsset = (asset) => {
    if (asset.type === 'model' || asset.type === 'local-model') {
        return preloadModel(asset);
    } else if (asset.type === 'texture') {
        // Textures for THREE.js (cube maps, etc.)
        return preloadTexture(asset);
    } else {
        // Regular images for HTML/CSS
        return preloadImage(asset);
    }
};

/**
 * useAssetPreloader Hook
 *
 * @param {Function} onComplete - Callback when all assets are loaded (called only once)
 * @returns {Object} { progress, currentAsset, loadedCount, totalAssets, isComplete }
 */
const useAssetPreloader = (onComplete) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const [currentAsset, setCurrentAsset] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Use ref to track if loading has started (prevent double-loading)
    const loadingStartedRef = useRef(false);
    const completeCalledRef = useRef(false);

    useEffect(() => {
        // Prevent double-loading in React StrictMode
        if (loadingStartedRef.current) return;
        loadingStartedRef.current = true;

        const loadAssets = async () => {
            try {
                // Immediately start preloading component chunks in parallel
                // This way components load alongside assets for faster initial render
                try {
                    const { preloadAllComponents } = await import('../../utils/componentPreloader');
                    preloadAllComponents();
                } catch (error) {
                    console.warn('⚠️ Could not preload components:', error);
                }

                // Get all assets in priority order
                const allAssets = getAssetsInPriorityOrder();

                // Split into critical (block initial render) and optional (load later)
                const criticalAssets = allAssets.filter(asset => CRITICAL_PRIORITIES.has(asset.priority));
                const optionalAssets = allAssets.filter(asset => !CRITICAL_PRIORITIES.has(asset.priority));

                const totalCritical = criticalAssets.length;
                setTotalAssets(totalCritical);

                if (totalCritical === 0) {
                    setIsComplete(true);
                    if (onComplete) onComplete();
                    // Still load optional assets in the background so later scenes are cached
                    if (optionalAssets.length) {
                        optionalAssets.forEach(asset => preloadAsset(asset));
                    }
                    return;
                }

                let loaded = 0;

                // Process critical assets in batches for concurrent loading
                for (let i = 0; i < criticalAssets.length; i += CONCURRENT_LOAD_LIMIT) {
                    const batch = criticalAssets.slice(i, i + CONCURRENT_LOAD_LIMIT);

                    // Load batch concurrently
                    const results = await Promise.all(
                        batch.map(asset => preloadAsset(asset))
                    );

                    // Update progress for each asset in batch
                    results.forEach(result => {
                        loaded++;
                        const progressPercent = (loaded / totalCritical) * 100;

                        setLoadedCount(loaded);
                        setProgress(progressPercent);
                        setCurrentAsset(result.asset.name);
                    });

                    // Small delay between batches to avoid overwhelming the browser
                    if (i + CONCURRENT_LOAD_LIMIT < criticalAssets.length) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }

                setIsComplete(true);

                // Call complete callback - but only once!
                if (onComplete && !completeCalledRef.current) {
                    completeCalledRef.current = true;
                    // Small delay before calling onComplete to let UI update
                    setTimeout(() => onComplete(), 100);
                }

                // Fire and forget optional assets so later navigation is smoother
                if (optionalAssets.length) {
                    optionalAssets.forEach(asset => preloadAsset(asset));
                }

            } catch (error) {
                console.error('❌ Error during asset preloading:', error);
                // Even on error, mark as complete to avoid blocking
                setIsComplete(true);
                if (onComplete && !completeCalledRef.current) {
                    completeCalledRef.current = true;
                    onComplete();
                }
            }
        };

        // Safety timeout: never block the app beyond the fallback window
        const fallbackTimer = setTimeout(() => {
            if (!completeCalledRef.current) {
                completeCalledRef.current = true;
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        }, FALLBACK_COMPLETE_MS);

        loadAssets();

        return () => {
            clearTimeout(fallbackTimer);
        };
    }, [onComplete]);

    return {
        progress,
        currentAsset,
        loadedCount,
        totalAssets,
        isComplete
    };
};

export default useAssetPreloader;
