/**
 * Asset Collector Utility
 *
 * Programmatically collects all asset URLs from data files
 * for preloading before the main application loads.
 *
 * Assets include:
 * - 3D Models (.glb files) from star systems and local models
 * - Images (project screenshots, avatars, backgrounds)
 * - Cube map textures for space background
 */

import { STAR_SYSTEMS } from '../data/starSystemsData';
import projectsData from '../data/projectsData';

// Cube map texture URLs - LOCAL
const CUBE_MAP_IMAGES = [
    '/images/SpaceCubeMap/Star1.jpeg', // Positive X (right)
    '/images/SpaceCubeMap/Star2.jpeg', // Negative X (left)
    '/images/SpaceCubeMap/Star3.jpeg', // Positive Y (top)
    '/images/SpaceCubeMap/Star4.jpeg', // Negative Y (bottom)
    '/images/SpaceCubeMap/Star5.jpeg', // Positive Z (front)
    '/images/SpaceCubeMap/Star6.jpeg', // Negative Z (back)
];

// CRITICAL: Core 3D models that must load during loading screen
// These are used directly in StarSystem.jsx and not in starSystemsData
const CORE_MODELS = [
    { url: '/models/Sun.glb', name: 'Sun', priority: 'critical' }, // 6.2MB - center of star system
];

/**
 * Collects all assets that need to be preloaded
 * @returns {Object} Object containing arrays of models, images, and cube textures
 */
export const collectAssets = () => {
    const assets = {
        models: [],
        images: [],
        cubeTextures: []
    };

    // Track unique URLs to avoid duplicates
    const seenModelUrls = new Set();
    const seenImageUrls = new Set();

    // 0. Add CRITICAL core models first (Sun.glb) - highest priority
    CORE_MODELS.forEach(model => {
        if (!seenModelUrls.has(model.url)) {
            seenModelUrls.add(model.url);
            assets.models.push({
                url: model.url,
                name: model.name,
                type: 'local-model',
                priority: model.priority
            });
        }
    });

    // 1. Collect 3D models from star systems
    try {
        Object.values(STAR_SYSTEMS).forEach(system => {
            system.planets.forEach(planet => {
                const url = planet.modelPath;

                // Only add unique URLs
                if (!seenModelUrls.has(url)) {
                    seenModelUrls.add(url);
                    // Saturn.glb is 2.1MB - still load it with planets
                    // All planet models are critical since StarSystem needs them immediately
                    assets.models.push({
                        url,
                        name: planet.name,
                        type: url.startsWith('http') ? 'model' : 'local-model',
                        priority: 'critical' // Planet models needed immediately - load during loading screen
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error collecting star system models:', error);
    }

    // 2. Add local cockpit model (deferred - loads in background after app shows)
    // Large model (12MB) - can load lazily while user goes through launch sequence
    assets.models.push({
        url: '/models/SpaceshipCockpit.glb',
        name: 'Cockpit',
        type: 'local-model',
        priority: 'deferred' // Loads in background, doesn't block loading screen
    });

    // 3. Collect cube map textures (high priority - needed for background)
    CUBE_MAP_IMAGES.forEach((url, idx) => {
        assets.cubeTextures.push({
            url,
            name: `Space Texture ${idx + 1}`,
            type: 'texture',
            priority: 'high'
        });
    });

    // 4. Collect project screenshots
    try {
        projectsData.forEach(project => {
            if (project.screenshots && Array.isArray(project.screenshots)) {
                project.screenshots.forEach((url, idx) => {
                    if (!seenImageUrls.has(url)) {
                        seenImageUrls.add(url);
                        assets.images.push({
                            url,
                            name: `${project.name} - Screenshot ${idx + 1}`,
                            type: 'image',
                            priority: 'low' // Project images can load last
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error collecting project images:', error);
    }

    // 5. Collect additional images (avatar, backgrounds)
    // Avatar from AboutMe page
    const avatarUrl = '/images/Avatar.jpeg';
    if (!seenImageUrls.has(avatarUrl)) {
        assets.images.push({
            url: avatarUrl,
            name: 'Avatar',
            type: 'image',
            priority: 'medium'
        });
    }

    // PlanetDetailScene CSS background (using cube map texture)
    const planetDetailBgUrl = '/images/SpaceCubeMap/Star2.jpeg';
    if (!seenImageUrls.has(planetDetailBgUrl)) {
        seenImageUrls.add(planetDetailBgUrl);
        assets.images.push({
            url: planetDetailBgUrl,
            name: 'Planet Detail Background',
            type: 'image',
            priority: 'high' // High priority since used in planet detail scenes
        });
    }

    return assets;
};

/**
 * Get only critical assets that block the initial load screen
 * Critical = 'critical' or 'high' priority: Sun, planet models, cube map textures
 * These must load during the loading screen so they're ready when entering star system
 *
 * Medium priority (cockpit) loads after these but before app shows
 *
 * @returns {Array} Array of critical assets only
 */
export const getCriticalAssetsOnly = () => {
    const assets = collectAssets();

    // Flatten all assets
    const allAssets = [
        ...assets.models,
        ...assets.cubeTextures,
        ...assets.images
    ];

    // Filter to critical and high priority assets (Sun, planet models, cube maps)
    // These MUST be loaded before showing the app to avoid models loading late
    return allAssets.filter(asset => asset.priority === 'critical' || asset.priority === 'high');
};

/**
 * Get non-critical assets that can load in background after initial screen
 * @returns {Array} Array of deferred and low priority assets
 */
export const getDeferredAssets = () => {
    const assets = collectAssets();

    const allAssets = [
        ...assets.models,
        ...assets.cubeTextures,
        ...assets.images
    ];

    // Return only low and deferred priority assets (project images, etc.)
    // Medium priority now loads during loading screen with critical assets
    return allAssets.filter(asset => ['low', 'deferred'].includes(asset.priority));
};

/**
 * Get all assets in priority order for optimized loading
 * High priority: Cube maps (needed for background)
 * Medium priority: Avatar
 * Low priority: Small planet models, project images
 * Deferred: Heavy models (12MB+) - load after initial screen
 *
 * @returns {Array} Flat array of all assets sorted by priority
 */
export const getAssetsInPriorityOrder = () => {
    const assets = collectAssets();

    // Flatten all assets into a single array
    const allAssets = [
        ...assets.models,
        ...assets.cubeTextures,
        ...assets.images
    ];

    // Sort by priority: high → medium → low → deferred
    const priorityOrder = { high: 0, medium: 1, low: 2, deferred: 3 };
    allAssets.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    return allAssets;
};

/**
 * Get total asset count
 * @returns {number} Total number of assets to preload
 */
export const getTotalAssetCount = () => {
    const assets = collectAssets();
    return assets.models.length + assets.images.length + assets.cubeTextures.length;
};

/**
 * Get asset statistics for logging
 * @returns {Object} Asset count breakdown
 */
export const getAssetStats = () => {
    const assets = collectAssets();
    return {
        models: assets.models.length,
        images: assets.images.length,
        cubeTextures: assets.cubeTextures.length,
        total: assets.models.length + assets.images.length + assets.cubeTextures.length
    };
};
