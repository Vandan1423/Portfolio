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
import { getAssetsInPriorityOrder, getAssetStats } from '../../utils/assetCollector';

// Maximum number of assets to load concurrently
const CONCURRENT_LOAD_LIMIT = 5;

/**
 * Preload a single image or texture
 * @param {Object} asset - Asset object with url and name
 * @returns {Promise} Resolves when image is loaded
 */
const preloadImage = (asset) => {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
            console.log(`✅ Loaded image: ${asset.name}`);
            resolve({ success: true, asset });
        };

        img.onerror = (error) => {
            console.warn(`⚠️ Failed to load image: ${asset.name}`, error);
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
            console.log(`✅ Preloaded model: ${asset.name}`);
            resolve({ success: true, asset });
        } catch (error) {
            console.warn(`⚠️ Failed to preload model: ${asset.name}`, error);
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
    } else {
        // Images and textures use the same loading method
        return preloadImage(asset);
    }
};

/**
 * useAssetPreloader Hook
 *
 * @param {Function} onProgress - Callback(loadedCount, totalCount, currentAsset)
 * @param {Function} onComplete - Callback when all assets are loaded
 * @returns {Object} { progress, currentAsset, loadedCount, totalAssets, isComplete }
 */
const useAssetPreloader = (onProgress, onComplete) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const [totalAssets, setTotalAssets] = useState(0);
    const [currentAsset, setCurrentAsset] = useState('Initializing...');
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    // Use ref to track if loading has started (prevent double-loading)
    const loadingStartedRef = useRef(false);

    useEffect(() => {
        // Prevent double-loading in React StrictMode
        if (loadingStartedRef.current) return;
        loadingStartedRef.current = true;

        const loadAssets = async () => {
            try {
                // Get all assets in priority order
                const allAssets = getAssetsInPriorityOrder();
                const total = allAssets.length;

                setTotalAssets(total);

                console.log('🚀 Starting asset preload...');
                console.log('📊 Asset stats:', getAssetStats());

                if (total === 0) {
                    console.warn('⚠️ No assets to load');
                    setIsComplete(true);
                    if (onComplete) onComplete();
                    return;
                }

                let loaded = 0;

                // Process assets in batches for concurrent loading
                for (let i = 0; i < allAssets.length; i += CONCURRENT_LOAD_LIMIT) {
                    const batch = allAssets.slice(i, i + CONCURRENT_LOAD_LIMIT);

                    // Load batch concurrently
                    const results = await Promise.all(
                        batch.map(asset => preloadAsset(asset))
                    );

                    // Update progress for each asset in batch
                    results.forEach(result => {
                        loaded++;
                        const progressPercent = (loaded / total) * 100;

                        setLoadedCount(loaded);
                        setProgress(progressPercent);
                        setCurrentAsset(result.asset.name);

                        // Call progress callback
                        if (onProgress) {
                            onProgress(loaded, total, result.asset.name);
                        }
                    });

                    // Small delay between batches to avoid overwhelming the browser
                    if (i + CONCURRENT_LOAD_LIMIT < allAssets.length) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                }

                console.log('✨ All assets preloaded successfully!');
                console.log(`📦 Loaded ${loaded}/${total} assets`);

                setIsComplete(true);

                // Call complete callback
                if (onComplete) {
                    // Small delay before calling onComplete to let UI update
                    setTimeout(() => onComplete(), 100);
                }

            } catch (error) {
                console.error('❌ Error during asset preloading:', error);
                // Even on error, mark as complete to avoid blocking
                setIsComplete(true);
                if (onComplete) onComplete();
            }
        };

        loadAssets();
    }, [onProgress, onComplete]);

    return {
        progress,
        currentAsset,
        loadedCount,
        totalAssets,
        isComplete
    };
};

export default useAssetPreloader;
