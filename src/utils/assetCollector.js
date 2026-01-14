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

    // 1. Collect 3D models from star systems
    try {
        Object.values(STAR_SYSTEMS).forEach(system => {
            system.planets.forEach(planet => {
                const url = planet.modelPath;

                // Only add unique URLs
                if (!seenModelUrls.has(url)) {
                    seenModelUrls.add(url);
                    // Saturn.glb is 12MB - mark as deferred to prevent blocking initial load
                    // All other planet models are critical since StarSystem needs them immediately
                    const isHeavyModel = url.includes('Saturn.glb');
                    assets.models.push({
                        url,
                        name: planet.name,
                        type: url.startsWith('http') ? 'model' : 'local-model',
                        priority: isHeavyModel ? 'deferred' : 'high' // Planet models needed immediately
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error collecting star system models:', error);
    }

    // 2. Add local cockpit model (deferred - loads after initial view)
    // Large model (12MB) - not needed until CockpitInterior component renders
    assets.models.unshift({
        url: '/models/SpaceshipCockpit.glb',
        name: 'Cockpit',
        type: 'local-model',
        priority: 'deferred' // Loads in background, not blocking
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
 * Critical = 'high' priority: Cube map textures, planet models, planet detail background
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

    // Filter to only high priority assets (planet models + cube maps)
    // These MUST be loaded before showing the app to avoid 3-minute delay
    return allAssets.filter(asset => asset.priority === 'high');
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

    // Return medium, low, and deferred priority assets
    return allAssets.filter(asset => ['medium', 'low', 'deferred'].includes(asset.priority));
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
