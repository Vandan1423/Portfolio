/**
 * Component Preloader Utility
 *
 * Preloads all lazy-loaded React components during the initial loading phase.
 * This ensures component JavaScript bundles are downloaded and ready before
 * the user navigates, eliminating delays when switching between scenes.
 *
 * Why this is needed:
 * - Assets (textures, models) can be preloaded separately
 * - BUT lazy components' JavaScript code isn't loaded until first render
 * - This causes 3-8 second delays when entering new scenes
 * - Solution: Preload the component chunks alongside assets
 */

/**
 * Preload all critical components
 * Call this during the initial asset loading phase
 */
export const preloadAllComponents = () => {

    // Preload 3D components (highest priority - user sees these first)
    import("../components/3D/CockpitInterior");
    import("../components/3D/SpaceCubeMap");
    import("../components/3D/StarSystem");
    import("../components/3D/Wormhole");
    import("../components/3D/LaunchSequence");
    import("../components/3D/PlanetDetailScene");
    import("../components/UI/NeuralLinkMap");

    // Preload page components (lower priority but still important)
    import("../pages/AboutMe/AboutMe");
    import("../pages/Projects/Projects");
    import("../pages/Experience/Experience");
    import("../pages/Contact/Contact");
    import("../pages/Technologies/Technologies");
    import("../pages/Journey/Journey");
};
