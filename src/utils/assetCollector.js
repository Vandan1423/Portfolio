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

// Cube map texture URLs from SpaceCubeMap component
const CUBE_MAP_IMAGES = [
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048720/Star1_k9qpl9.png', // Positive X (right)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048721/Star2_e224oc.png', // Negative X (left)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048724/Star3_ptf4ey.png', // Positive Y (top)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048725/Star4_nj5osv.png', // Negative Y (bottom)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048715/Star5_rd4aab.png', // Positive Z (front)
    'https://res.cloudinary.com/didezuerl/image/upload/v1766048729/Star6_zqxvin.png', // Negative Z (back)
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
                    const isHeavyModel = url.includes('Saturn.glb');
                    assets.models.push({
                        url,
                        name: planet.name,
                        type: url.startsWith('http') ? 'model' : 'local-model',
                        priority: isHeavyModel ? 'deferred' : 'low' // Heavy models load lazily
                    });
                }
            });
        });
    } catch (error) {
        console.error('Error collecting star system models:', error);
    }

    // 2. Add local cockpit model (medium priority - loads early but doesn't block)
    // Too large (12MB) to block loading screen, but loads immediately after
    assets.models.unshift({
        url: '/models/SpaceshipCockpit.glb',
        name: 'Cockpit',
        type: 'local-model',
        priority: 'medium' // Loads right after critical assets
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
    const avatarUrl = 'https://res.cloudinary.com/didezuerl/image/upload/v1766049447/Avatar_fnr2xa.png';
    if (!seenImageUrls.has(avatarUrl)) {
        assets.images.push({
            url: avatarUrl,
            name: 'Avatar',
            type: 'image',
            priority: 'medium'
        });
    }

    // PlanetDetailScene CSS background (also in cube map, but needs to be preloaded as image for CSS)
    const planetDetailBgUrl = 'https://res.cloudinary.com/didezuerl/image/upload/v1766048721/Star2_e224oc.png';
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
 * Critical = 'high' priority: Cube map textures, planet detail background
 * These load FAST (small files) to show loading screen quickly
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

    // Filter to only high priority assets (small, fast to load)
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
