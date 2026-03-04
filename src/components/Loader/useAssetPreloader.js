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
import { getCriticalAssetsOnly, getDeferredAssets, collectAssets } from '../../utils/assetCollector';
import * as THREE from 'three';
import { getGLTFLoader } from '../../utils/dracoLoader';

// Maximum number of assets to load concurrently
const CONCURRENT_LOAD_LIMIT = 5;

// Timeout for individual asset loading (30 seconds)
const ASSET_LOAD_TIMEOUT = 30000;

// Global timeout for entire preload process (60 seconds)
const GLOBAL_PRELOAD_TIMEOUT = 60000;

/**
 * Wraps a promise with a timeout
 * @param {Promise} promise - The promise to wrap
 * @param {number} timeoutMs - Timeout in milliseconds
 * @param {Object} asset - Asset object for error reporting
 * @returns {Promise} Promise that rejects if timeout is exceeded
 */
const withTimeout = (promise, timeoutMs, asset) => {
    return Promise.race([
        promise,
        new Promise((resolve) =>
            setTimeout(() => {
                console.warn(`⏱️ Timeout loading ${asset.name} after ${timeoutMs}ms`);
                resolve({ success: false, asset, timeout: true });
            }, timeoutMs)
        )
    ]);
};

/**
 * Preload a texture using THREE.js TextureLoader
 * This ensures textures are cached properly for THREE.js components
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when texture is loaded or times out
 */
const preloadTexture = (asset) => {
    const loadPromise = new Promise((resolve) => {
        const loader = new THREE.TextureLoader();

        loader.load(
            asset.url,
            (texture) => {
                // Texture loaded successfully and cached in THREE.js
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve({ success: true, asset });
            },
            undefined,
            (error) => {
                console.warn(`❌ Failed to load texture ${asset.name}:`, error);
                resolve({ success: false, asset });
            }
        );
    });

    return withTimeout(loadPromise, ASSET_LOAD_TIMEOUT, asset);
};

/**
 * Preload a single image (for HTML/CSS use, not THREE.js)
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when image is loaded or times out
 */
const preloadImage = (asset) => {
    const loadPromise = new Promise((resolve) => {
        const img = new Image();

        // Enable CORS for Cloudinary images
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            resolve({ success: true, asset });
        };

        img.onerror = (error) => {
            console.warn(`❌ Failed to load image ${asset.name}:`, error);
            resolve({ success: false, asset }); // Resolve anyway to continue
        };

        img.src = asset.url;
    });

    return withTimeout(loadPromise, ASSET_LOAD_TIMEOUT, asset);
};

/**
 * Preload a single 3D model with Draco support
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when model is preloaded or times out
 */
const preloadModel = (asset) => {
    const loadPromise = new Promise((resolve) => {
        try {
            // First, tell useGLTF to preload (this caches for later use)
            // Do this BEFORE loading to ensure cache is ready
            useGLTF.preload(asset.url);
            
            // Use Draco-enabled GLTF loader for compressed models
            const loader = getGLTFLoader();

            loader.load(
                asset.url,
                () => {
                    // Model loaded successfully
                    resolve({ success: true, asset });
                },
                undefined,
                (error) => {
                    console.warn(`❌ Failed to load model ${asset.name}:`, error);
                    resolve({ success: false, asset });
                }
            );
        } catch (error) {
            console.warn(`❌ Failed to initialize loader for ${asset.name}:`, error);
            resolve({ success: false, asset }); // Resolve anyway to continue
        }
    });

    return withTimeout(loadPromise, ASSET_LOAD_TIMEOUT, asset);
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
                // CRITICAL: Wait a brief moment to ensure loader UI renders before heavy operations
                // This prevents white screen flash - UI shows first, then loading starts
                await new Promise(resolve => setTimeout(resolve, 100));

                // Immediately start preloading component chunks in parallel
                // This way components load alongside assets for faster initial render
                try {
                    const { preloadAllComponents } = await import('../../utils/componentPreloader');
                    preloadAllComponents();
                } catch (error) {
                    console.warn('⚠️ Could not preload components:', error);
                }

                // TIERED LOADING STRATEGY:
                // Phase 1: Critical + Medium assets (Sun, planets, cube textures, cockpit) - load during screen
                // Phase 2: Deferred assets (project images) - background after app loads

                // Get critical assets (Sun, planets, cube maps)
                const criticalAssets = getCriticalAssetsOnly();
                
                // Get medium priority assets (cockpit, avatar)
                const allAssets = collectAssets();
                const mediumAssets = [...allAssets.models, ...allAssets.images].filter(
                    asset => asset.priority === 'medium'
                );
                
                // Combine for progress tracking - all load during loading screen
                const essentialAssets = [...criticalAssets, ...mediumAssets];
                const essentialCount = essentialAssets.length;

                // For progress tracking, count all essential assets
                setTotalAssets(essentialCount);

                console.log(`📦 Loading ${essentialCount} essential assets (Sun, planets, cube maps, cockpit)`);

                if (essentialCount === 0) {
                    setIsComplete(true);
                    if (onComplete) onComplete();
                    return;
                }

                let loaded = 0;

                // Load ALL essential assets with progress tracking
                for (let i = 0; i < essentialAssets.length; i += CONCURRENT_LOAD_LIMIT) {
                    const batch = essentialAssets.slice(i, i + CONCURRENT_LOAD_LIMIT);

                    // Load batch concurrently
                    const results = await Promise.all(
                        batch.map(asset => preloadAsset(asset))
                    );

                    // Update progress for each asset in batch
                    results.forEach(result => {
                        loaded++;
                        const progressPercent = (loaded / essentialCount) * 100;

                        setLoadedCount(loaded);
                        setProgress(progressPercent);
                        setCurrentAsset(result.asset.name);

                        // Log failures
                        if (!result.success) {
                            console.warn(`⚠️ Skipped asset: ${result.asset.name}${result.timeout ? ' (timeout)' : ''}`);
                        }
                    });

                    // Small delay between batches
                    if (i + CONCURRENT_LOAD_LIMIT < essentialAssets.length) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }

                // All essential assets done!
                console.log(`✅ All essential assets loaded (Sun, planets, cube maps, cockpit)!`);

                // All critical assets loaded - show app!
                setIsComplete(true);

                // Call complete callback
                if (onComplete && !completeCalledRef.current) {
                    completeCalledRef.current = true;
                    setTimeout(() => onComplete(), 100);
                }

                // Phase 2: Load deferred assets in background (don't block)
                // This includes heavy 12MB models that load lazily
                const deferredAssets = getDeferredAssets();
                if (deferredAssets.length > 0) {
                    console.log(`📦 Loading ${deferredAssets.length} deferred assets in background (heavy models, images)`);

                    // Use requestIdleCallback for low-priority background loading
                    const loadDeferredInBackground = () => {
                        let deferredLoaded = 0;

                        // Load deferred assets (don't update progress bar - app is already shown)
                        const loadDeferredBatch = async () => {
                            for (let i = 0; i < deferredAssets.length; i += CONCURRENT_LOAD_LIMIT) {
                                const batch = deferredAssets.slice(i, i + CONCURRENT_LOAD_LIMIT);

                                const results = await Promise.all(
                                    batch.map(asset => preloadAsset(asset))
                                );

                                deferredLoaded += batch.length;
                                console.log(`📥 Background: Loaded ${deferredLoaded}/${deferredAssets.length} deferred assets`);

                                // Longer delay for background loading (don't compete with main app)
                                await new Promise(resolve => setTimeout(resolve, 500));
                            }

                            console.log(`✅ All deferred assets loaded in background`);
                        };

                        loadDeferredBatch().catch(error => {
                            console.warn('⚠️ Error loading deferred assets:', error);
                        });
                    };

                    // Start background loading after a short delay (500ms for faster startup)
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(loadDeferredInBackground, { timeout: 500 });
                    } else {
                        setTimeout(loadDeferredInBackground, 500);
                    }
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

        // Add global timeout safety net
        const globalTimeout = setTimeout(() => {
            console.warn(`⏱️ Global preload timeout (${GLOBAL_PRELOAD_TIMEOUT}ms) - forcing completion`);
            setIsComplete(true);
            if (onComplete && !completeCalledRef.current) {
                completeCalledRef.current = true;
                onComplete();
            }
        }, GLOBAL_PRELOAD_TIMEOUT);

        loadAssets().finally(() => {
            clearTimeout(globalTimeout);
        });

        return () => {
            clearTimeout(globalTimeout);
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
