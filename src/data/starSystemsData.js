/**
 * Star Systems Data
 *
 * Centralized data for all 4 star systems in the portfolio
 * Each star system represents a different page/section
 * Each system contains planets that represent sub-sections or content items
 */

import { projects, experience, positions } from './profile';

// Projects and Experience planets take their label and content from profile.js:
// the first planet shows the first item, and so on. A planet with no matching
// item shows an empty panel, so keep the counts in step when adding planets.
const featuredProjects = projects.filter((project) => project.featured);
const roles = [...experience, ...positions];

const projectPlanet = (index) => ({
    name: featuredProjects[index]?.name ?? `Project ${index + 1}`,
    sectionId: featuredProjects[index]?.id ?? null,
});

const rolePlanet = (index) => ({
    name: roles[index]?.org ?? `Role ${index + 1}`,
    sectionId: roles[index]?.id ?? null,
});

export const STAR_SYSTEMS = {
    "alpha-centauri": {
        id: "alpha-centauri",
        name: "Alpha Centauri",
        code: "SYS-01",
        page: "About Me",
        description: "Personal information & introduction",
        color: "amber", // wormhole colour, see Wormhole.jsx
        // Surface configuration for planet exploration
        surface: {
            theme: 'rocky',
            groundColor: '#8B4513',
            atmosphereColor: '#ff6b35',
            skyColor: '#1a0a00',
        },
        planets: [
            {
                id: "personal-info",
                name: "Personal Info",
                modelPath: "/models/Pluto.glb",
                scale: 2.0,
                size: 1.2,
                orbitRadius: 15,
                orbitSpeed: 0.075,
                rotationSpeed: 0.002,
                color: "#4ade80",
                emissive: "#4ade80",
                emissiveIntensity: 0.3,
                rings: false,
                sectionId: "personal-info",
                orbitColor: "#4ade80",
                detailOffset: [0, 0, 0],
            },
            {
                id: "education",
                name: "Education",
                modelPath: "/models/Earth.glb",
                scale: 2.2,
                size: 0.9,
                orbitRadius: 30,
                orbitSpeed: 0.06,
                rotationSpeed: 0.0022,
                color: "#60a5fa",
                emissive: "#60a5fa",
                emissiveIntensity: 0.28,
                rings: false,
                sectionId: "education",
                orbitColor: "#60a5fa",
                detailOffset: [0, -2.8, 0],
            },
            {
                id: "tech-stack",
                name: "Tech Stack",
                modelPath: "/models/Planet1.glb",
                scale: 3,
                size: 1.0,
                orbitRadius: 75,
                orbitSpeed: 0.045,
                rotationSpeed: 0.0028,
                color: "#14b8a6",
                emissive: "#14b8a6",
                emissiveIntensity: 0.3,
                rings: false,
                sectionId: "tech-stack",
                orbitColor: "#14b8a6",
                detailOffset: [0, 0, 0],
            },
            {
                id: "achievements",
                name: "Achievements",
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.1,
                orbitRadius: 85,
                orbitSpeed: 0.038,
                rotationSpeed: 0.002,
                color: "#f59e0b",
                emissive: "#f59e0b",
                emissiveIntensity: 0.32,
                rings: true,
                sectionId: "achievements",
                orbitColor: "#f59e0b",
                detailOffset: [0, 0, 0],
            },
            {
                id: "certifications",
                name: "Certifications",
                modelPath: "/models/Pluto.glb",
                scale: 2.0,
                size: 1.2,
                orbitRadius: 140,
                orbitSpeed: 0.1,
                rotationSpeed: 0.0026,
                color: "#ec4899",
                emissive: "#ec4899",
                emissiveIntensity: 0.28,
                rings: false,
                sectionId: "certifications",
                orbitColor: "#ec4899",

                detailOffset: [0, 0, 0],
            },
        ],
    },
    sirius: {
        id: "sirius",
        name: "Sirius",
        code: "SYS-02",
        page: "Projects",
        description: "Portfolio & project showcase",
        color: "amber", // wormhole colour, see Wormhole.jsx
        surface: {
            theme: 'tech',
            groundColor: '#1a1a2e',
            atmosphereColor: '#3b82f6',
            skyColor: '#0a0a1a',
        },
        planets: [
            {
                id: "project-1",
                ...projectPlanet(0),
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.3,
                orbitRadius: 15,
                orbitSpeed: 0.06,
                rotationSpeed: 0.002,
                color: "#a855f7",
                emissive: "#a855f7",
                emissiveIntensity: 0.35,
                rings: true,
                orbitColor: "#a855f7",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-2",
                ...projectPlanet(1),
                modelPath: "/models/Earth.glb",
                scale: 2.2,
                size: 1.25,
                orbitRadius: 30,
                orbitSpeed: 0.055,
                rotationSpeed: 0.002,
                color: "#3b82f6",
                emissive: "#3b82f6",
                emissiveIntensity: 0.33,
                rings: false,
                orbitColor: "#3b82f6",
                detailOffset: [0, -2.8, 0],
            },
            {
                id: "project-3",
                ...projectPlanet(2),
                modelPath: "/models/Planet1.glb",
                scale: 3,
                size: 1.1,
                orbitRadius: 50,
                orbitSpeed: 0.048,
                rotationSpeed: 0.0024,
                color: "#8b5cf6",
                emissive: "#8b5cf6",
                emissiveIntensity: 0.32,
                rings: false,
                orbitColor: "#8b5cf6",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-4",
                ...projectPlanet(3),
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.2,
                orbitRadius: 70,
                orbitSpeed: 0.04,
                rotationSpeed: 0.0022,
                color: "#06b6d4",
                emissive: "#06b6d4",
                emissiveIntensity: 0.33,
                rings: true,
                orbitColor: "#06b6d4",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-5",
                ...projectPlanet(4),
                modelPath: "/models/Pluto.glb",
                scale: 2.0,
                size: 1.2,
                orbitRadius: 90,
                orbitSpeed: 0.035,
                rotationSpeed: 0.0026,
                color: "#10b981",
                emissive: "#10b981",
                emissiveIntensity: 0.3,
                rings: false,
                orbitColor: "#10b981",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-6",
                ...projectPlanet(5),
                modelPath: "/models/Planet1.glb",
                scale: 3,
                size: 1.0,
                orbitRadius: 110,
                orbitSpeed: 0.03,
                rotationSpeed: 0.0028,
                color: "#f59e0b",
                emissive: "#f59e0b",
                emissiveIntensity: 0.31,
                rings: false,
                orbitColor: "#f59e0b",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-7",
                ...projectPlanet(6),
                modelPath: "/models/Pluto.glb",
                scale: 2.0,
                size: 1.15,
                orbitRadius: 130,
                orbitSpeed: 0.025,
                rotationSpeed: 0.0025,
                color: "#22c55e",
                emissive: "#22c55e",
                emissiveIntensity: 0.29,
                rings: false,
                orbitColor: "#22c55e",
                detailOffset: [0, 0, 0],
            },
            {
                id: "project-8",
                ...projectPlanet(7),
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.05,
                orbitRadius: 150,
                orbitSpeed: 0.022,
                rotationSpeed: 0.0023,
                color: "#fb923c",
                emissive: "#fb923c",
                emissiveIntensity: 0.28,
                rings: false,
                orbitColor: "#fb923c",
                detailOffset: [0, 0, 0],
            },
        ],
    },

    vega: {
        id: "vega",
        name: "Vega",
        code: "SYS-03",
        page: "Experience",
        description: "Professional journey & timeline",
        color: "amber", // wormhole colour, see Wormhole.jsx
        surface: {
            theme: 'crystal',
            groundColor: '#2a0040',
            atmosphereColor: '#8b5cf6',
            skyColor: '#0d001a',
        },
        planets: [
            {
                id: "exp-1",
                ...rolePlanet(0),
                modelPath: "/models/Earth.glb",
                scale: 2.2,
                size: 1.3,
                orbitRadius: 15,
                orbitSpeed: 0.07,
                rotationSpeed: 0.0019,
                color: "#a855f7",
                emissive: "#a855f7",
                emissiveIntensity: 0.35,
                rings: false,
                orbitColor: "#a855f7",
                detailOffset: [0, -2.8, 0],
            },
            {
                id: "exp-2",
                ...rolePlanet(1),
                modelPath: "/models/Planet1.glb",
                scale: 3,
                size: 1.2,
                orbitRadius: 25,
                orbitSpeed: 0.06,
                rotationSpeed: 0.0021,
                color: "#ec4899",
                emissive: "#ec4899",
                emissiveIntensity: 0.33,
                rings: false,
                orbitColor: "#ec4899",
                detailOffset: [0, 0, 0],
            },
            {
                id: "exp-3",
                ...rolePlanet(2),
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.1,
                orbitRadius: 45,
                orbitSpeed: 0.05,
                rotationSpeed: 0.0023,
                color: "#8b5cf6",
                emissive: "#8b5cf6",
                emissiveIntensity: 0.31,
                rings: true,
                orbitColor: "#8b5cf6",
                detailOffset: [0, 0, 0],
            },
            {
                id: "exp-4",
                ...rolePlanet(3),
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.0,
                orbitRadius: 75,
                orbitSpeed: 0.042,
                rotationSpeed: 0.0025,
                color: "#06b6d4",
                emissive: "#06b6d4",
                emissiveIntensity: 0.3,
                rings: false,
                orbitColor: "#06b6d4",
                detailOffset: [0, 0, 0],
            },
        ],
    },

    polaris: {
        id: "polaris",
        name: "Polaris",
        code: "SYS-04",
        page: "Journey",
        description: "Career path & milestones",
        color: "amber", // wormhole colour, see Wormhole.jsx
        surface: {
            theme: 'ice',
            groundColor: '#e0f7fa',
            atmosphereColor: '#6366f1',
            skyColor: '#0a0a1f',
        },
        planets: [
            {
                id: "journey-milestones",
                name: "Milestone Station",
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 1.25,
                orbitRadius: 20,
                orbitSpeed: 0.06,
                rotationSpeed: 0.002,
                color: "#6366f1",
                emissive: "#6366f1",
                emissiveIntensity: 0.34,
                rings: true,
                sectionId: "journey-milestones",
                orbitColor: "#6366f1",
                detailOffset: [0, 0, 0],
            },
            {
                id: "journey-achievements",
                name: "Achievement Cluster",
                modelPath: "/models/Planet2.glb",
                scale: 3,
                size: 0.95,
                orbitRadius: 40,
                orbitSpeed: 0.042,
                rotationSpeed: 0.0026,
                color: "#818cf8",
                emissive: "#818cf8",
                emissiveIntensity: 0.3,
                rings: false,
                sectionId: "journey-achievements",
                orbitColor: "#818cf8",
                detailOffset: [0, 0, 0],
            },
        ],
    },
};

/**
 * Get star system by ID
 * @param {string} systemId - ID of the star system
 * @returns {object} Star system data
 */
export const getStarSystem = (systemId) => {
    return STAR_SYSTEMS[systemId] || STAR_SYSTEMS["alpha-centauri"];
};

/**
 * Get all star systems as an array
 * @returns {array} Array of all star systems
 */ export const getAllStarSystems = () => {
    return Object.values(STAR_SYSTEMS);
};

/**
 * Get star system metadata (without planets) for navigation
 * @returns {array} Array of star system metadata
 */
export const getStarSystemsMetadata = () => {
    return getAllStarSystems().map(
        ({ id, name, code, page, description, color }) => ({
            id,
            name,
            code,
            page,
            description,
            color,
        })
    );
};
