// Helper script to add missing model data to planets
// Run this once to update starSystemsData.js with model paths

const modelAssignments = {
    "alpha-centauri": [
        { sectionId: "personal-info", modelPath: "/models/Pluto.glb", scale: 2.0, yOffset: -1.8 },
        { sectionId: "education", modelPath: "/models/Earth.glb", scale: 2.2, yOffset: -2 },
        { sectionId: "interests", modelPath: "/models/Planet2.glb", scale: 5, yOffset: 0 },
        { sectionId: "tech-stack", modelPath: "/models/Planet1.glb", scale: 3, yOffset: 0 },
        { sectionId: "achievements", modelPath: "/models/Saturn.glb", scale: 0.015, yOffset: 0 },
        { sectionId: "resume", modelPath: "/models/Neptune.glb", scale: 2.3, yOffset: 0 },
        { sectionId: "certifications", modelPath: "/models/Pluto.glb", scale: 2.0, yOffset: -1.5 },
    ],
    "sirius": [
        { sectionId: "project-1", modelPath: "/models/Earth.glb", scale: 2.2, yOffset: -2 },
        { sectionId: "project-2", modelPath: "/models/Planet1.glb", scale: 3, yOffset: 0 },
        { sectionId: "project-3", modelPath: "/models/Planet2.glb", scale: 5, yOffset: 0 },
        { sectionId: "project-4", modelPath: "/models/Neptune.glb", scale: 2.3, yOffset: 0 },
    ],
    "vega": [
        { sectionId: "exp-01", modelPath: "/models/Earth.glb", scale: 2.2, yOffset: -2 },
        { sectionId: "exp-02", modelPath: "/models/Planet1.glb", scale: 3, yOffset: 0 },
        { sectionId: "exp-03", modelPath: "/models/Saturn.glb", scale: 0.015, yOffset: 0 },
        { sectionId: "exp-04", modelPath: "/models/Planet2.glb", scale: 5, yOffset: 0 },
        { sectionId: "exp-05", modelPath: "/models/Pluto.glb", scale: 2.0, yOffset: -1.8 },
    ],
    "betelgeuse": [
        { sectionId: "contact-form", modelPath: "/models/Earth.glb", scale: 2.2, yOffset: -2 },
        { sectionId: "contact-info", modelPath: "/models/Planet1.glb", scale: 3, yOffset: 0 },
    ],
    "rigel": [
        { sectionId: "frontend", modelPath: "/models/Earth.glb", scale: 2.2, yOffset: -2 },
        { sectionId: "backend", modelPath: "/models/Planet1.glb", scale: 3, yOffset: 0 },
        { sectionId: "tools", modelPath: "/models/Planet2.glb", scale: 5, yOffset: 0 },
    ],
    "polaris": [
        { sectionId: "journey-milestones", modelPath: "/models/Saturn.glb", scale: 0.015, yOffset: 0 },
        { sectionId: "journey-achievements", modelPath: "/models/Planet2.glb", scale: 5, yOffset: 0 },
    ],
};

// Note: This is a reference file. The actual implementation should add these
// properties directly to the starSystemsData.js file for each planet.
export default modelAssignments;
