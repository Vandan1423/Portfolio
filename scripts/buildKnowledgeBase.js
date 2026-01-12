/**
 * Knowledge Base Builder Script
 *
 * Extracts portfolio data from all data files and builds a structured JSON
 * knowledge base for the AI assistant (ARIA) to use for answering questions.
 *
 * Run this script with: node scripts/buildKnowledgeBase.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import data files
import { STAR_SYSTEMS } from '../src/data/starSystemsData.js';
import projectsData from '../src/data/projectsData.js';

async function buildKnowledgeBase() {
  console.log('🤖 Building AI Knowledge Base...\n');

  const knowledgeBase = {
    personalInfo: {
      name: "Vandan Nagori",
      role: "Full Stack Developer",
      currentStatus: "Student at IIT Indore",
      bio: "Passionate full-stack developer specializing in modern web technologies and 3D graphics. Currently studying at IIT Indore with hands-on experience in MERN stack, Three.js, and building immersive web experiences.",
      email: "Available in Contact section",
      location: "IIT Indore, India"
    },

    systems: Object.values(STAR_SYSTEMS).map(system => ({
      id: system.id,
      name: system.name,
      code: system.code,
      page: system.page,
      description: system.description,
      planetCount: system.planets.length,
      planets: system.planets.map(planet => ({
        id: planet.id,
        name: planet.name,
        sectionId: planet.sectionId
      }))
    })),

    projects: projectsData.map(project => ({
      id: project.id,
      name: project.name,
      shortDescription: project.shortDescription,
      technologies: project.technologies,
      status: project.status,
      github: project.github,
      liveDemo: project.liveDemo,
      keyFeatures: project.keyFeatures?.slice(0, 3), // First 3 features only
    })),

    technologies: {
      frontend: [
        "React.js", "Three.js", "@react-three/fiber", "@react-three/drei",
        "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Bootstrap",
        "EJS", "Responsive Design", "CSS Modules"
      ],
      backend: [
        "Node.js", "Express.js", "MongoDB", "Mongoose",
        "RESTful APIs", "Authentication", "Session Management"
      ],
      tools: [
        "Git", "GitHub", "Vercel", "Cloudinary", "Vite",
        "npm", "Passport.js", "Bcrypt", "3D Modeling"
      ],
      specializations: [
        "3D Graphics Programming", "WebGL", "GLSL Shaders",
        "Performance Optimization", "Full-Stack Development"
      ]
    },

    experience: [
      {
        title: "Head of Web Development",
        organization: "Astronomy Club - IIT Indore",
        description: "Led website redesign and maintenance, improved UI/UX, fixed critical bugs",
        skills: ["React.js", "Tailwind CSS", "Team Leadership"]
      },
      {
        title: "Head of Technicals",
        organization: "Gaming Club - IIT Indore",
        description: "Coordinated technical development, built tournament management system",
        skills: ["HTML5", "CSS3", "JavaScript", "Node.js"]
      },
      {
        title: "PRIUS Fellowship",
        organization: "IIT Indore",
        description: "Research and development fellowship program",
        skills: ["Research", "Innovation", "Technical Skills"]
      }
    ],

    contact: {
      available: true,
      methods: ["Contact form on portfolio", "LinkedIn", "GitHub", "Email"],
      location: "Contact section in Betelgeuse System"
    },

    quickFacts: {
      totalProjects: projectsData.length,
      totalSystems: Object.keys(STAR_SYSTEMS).length,
      primarySkills: ["React.js", "Three.js", "Node.js", "MongoDB", "Express.js"],
      currentFocus: "3D Web Development, Full-Stack Applications",
      education: "IIT Indore"
    },

    navigationHelp: {
      systems: [
        { name: "Alpha Centauri (SYS-01)", contains: "Personal information, Education, Tech Stack, Achievements, Resume" },
        { name: "Sirius (SYS-02)", contains: "All 8 projects with live demos and GitHub links" },
        { name: "Vega (SYS-03)", contains: "Professional experience and roles" },
        { name: "Betelgeuse (SYS-04)", contains: "Contact form and contact information" },
        { name: "Polaris (SYS-05)", contains: "Career milestones and achievements" },
        { name: "Rigel (SYS-06)", contains: "Technologies: Frontend, Backend, Tools" }
      ]
    }
  };

  // Write to JSON file
  const outputPath = path.join(__dirname, '../src/data/aiKnowledgeBase.json');
  fs.writeFileSync(outputPath, JSON.stringify(knowledgeBase, null, 2));

  console.log('✅ Knowledge base built successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`\n📊 Stats:`);
  console.log(`   - Systems: ${knowledgeBase.systems.length}`);
  console.log(`   - Projects: ${knowledgeBase.projects.length}`);
  console.log(`   - Technologies: ${Object.values(knowledgeBase.technologies).flat().length}`);
  console.log(`   - Experience Entries: ${knowledgeBase.experience.length}`);
  console.log('\n🚀 AI is ready to assist users!\n');
}

// Run the builder
buildKnowledgeBase().catch(error => {
  console.error('❌ Error building knowledge base:', error);
  process.exit(1);
});
