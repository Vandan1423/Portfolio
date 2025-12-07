/**
 * Planet Section Data
 *
 * Each planet in the star system represents a different section of the portfolio.
 * This data is displayed when a planet is selected and viewed in detail.
 *
 * Structure:
 * - title: Main heading for the section
 * - subtitle: Secondary description
 * - description: Detailed paragraph about the section
 * - details: Array of label-value pairs for quick info
 * - stats: Numerical statistics to display
 * - highlights: Key points or achievements
 * - links: Related external links (optional)
 */

export const planetSectionData = {
    Pluto: {
        title: "About Me",
        subtitle: "The Explorer Behind the Code",
        description:
            "Third-year undergraduate at IIT Indore with a passion for building meaningful web applications. I specialize in full-stack development, creating solutions that combine intuitive user interfaces with robust backend systems.",
        detailScaleMultiplier: 1.0, // Scale adjustment for detail view (default: 1.0)
        verticalOffset: 0, // Y-axis offset in detail view (default: 0)
        axialTilt: 122, // Axial tilt in degrees (Pluto's actual tilt)
        details: [
            { label: "Name", value: "Vandan Nagori" },
            { label: "Role", value: "Full-Stack Developer" },
            { label: "Location", value: "IIT Indore, India" },
            { label: "Focus", value: "MERN Stack Development" },
            { label: "Year", value: "3rd Year B.Tech" },
        ],
        stats: [
            { label: "CGPA", value: "8.58", icon: "📊" },
            { label: "Projects", value: "4+", icon: "🚀" },
            { label: "Roles", value: "2", icon: "👑" },
        ],
        highlights: [
            "Head of Web Development - Astronomy Club",
            "Head of Technicals - Gaming Club",
            "MERN Stack Specialist",
            "Seeking Summer 2025 Internship",
        ],
        color: "#ffc649",
    },

    Earth: {
        title: "Technical Arsenal",
        subtitle: "Tools & Technologies I Command",
        description:
            "A comprehensive toolkit spanning frontend frameworks, backend technologies, databases, and development tools. Continuously expanding my knowledge with modern technologies.",
        detailScaleMultiplier: 1.0, // Scale adjustment for detail view
        verticalOffset: -3, // Y-axis offset in detail view
        axialTilt: 23.5, // Axial tilt in degrees (Earth's actual tilt)
        details: [
            { label: "Primary Stack", value: "MERN" },
            { label: "Frontend", value: "React, Tailwind" },
            { label: "Backend", value: "Node.js, Express" },
            { label: "Database", value: "MongoDB, SQL" },
            { label: "Languages", value: "JS, Java, Python" },
        ],
        stats: [
            { label: "Frontend", value: "90%", icon: "🎨" },
            { label: "Backend", value: "85%", icon: "⚙️" },
            { label: "DevOps", value: "70%", icon: "🔧" },
        ],
        highlights: [
            "React.js & React Three Fiber",
            "Node.js & Express.js",
            "MongoDB & Mongoose ODM",
            "Git, Vercel, Cloudinary",
            "Currently Learning: TypeScript, Next.js",
        ],
        color: "#4a90e2",
    },

    Planet1: {
        title: "Achievements",
        subtitle: "Milestones & Accomplishments",
        description:
            "A collection of notable achievements, research experiences, and competitions that have shaped my journey as a developer and problem solver.",
        detailScaleMultiplier: 1.0, // Scale adjustment for detail view
        verticalOffset: 0, // Y-axis offset in detail view
        axialTilt: 25, // Axial tilt in degrees
        details: [
            { label: "Research", value: "PRIUS Fellowship" },
            { label: "Competition", value: "ISRO-NRSC Challenge" },
            { label: "Leadership", value: "2 Club Head Positions" },
            { label: "Projects", value: "4+ Live Websites" },
        ],
        stats: [
            { label: "Research", value: "2", icon: "🔬" },
            { label: "Awards", value: "3+", icon: "🏆" },
            { label: "Users", value: "500+", icon: "👥" },
        ],
        highlights: [
            "PRIUS Fellowship - Galaxy Classification Research",
            "ISRO-NRSC National Challenge Participant",
            "Built production-ready web applications",
            "Led technical teams for multiple clubs",
        ],
        color: "#e27b58",
    },

    Planet2: {
        title: "Interests & Hobbies",
        subtitle: "Beyond the Code",
        description:
            "When I'm not coding, I explore the fascinating intersections of technology with astronomy, gaming, and creative problem-solving.",
        detailScaleMultiplier: 0.5, // Scale adjustment for detail view
        verticalOffset: 0, // Y-axis offset in detail view
        axialTilt: 3, // Axial tilt in degrees
        details: [
            { label: "Astronomy", value: "Stargazing & Research" },
            { label: "Gaming", value: "Esports & Game Dev" },
            { label: "Learning", value: "New Technologies" },
            { label: "Community", value: "Tech Clubs" },
        ],
        stats: [
            { label: "Clubs", value: "2", icon: "🎯" },
            { label: "Events", value: "10+", icon: "🎮" },
            { label: "Workshops", value: "5+", icon: "📚" },
        ],
        highlights: [
            "Astronomy Club - Web Development Head",
            "Gaming Club - Head of Technicals",
            "Organized multiple gaming tournaments",
            "Conducted web development workshops",
        ],
        color: "#9b59b6",
    },

    Saturn: {
        title: "Quick Links",
        subtitle: "Connect & Explore",
        description:
            "Find me across the digital universe. Check out my projects, connect on professional networks, or reach out directly.",
        detailScaleMultiplier: 0.004, // Scale adjustment for detail view
        verticalOffset: 0, // Y-axis offset in detail view
        axialTilt: 26.7, // Axial tilt in degrees (Saturn's actual tilt)
        details: [
            { label: "GitHub", value: "Vandan1423" },
            { label: "LinkedIn", value: "vandan-nagori" },
            { label: "Email", value: "vandannagori@gmail.com" },
            { label: "Resume", value: "Available" },
        ],
        stats: [
            { label: "Repos", value: "15+", icon: "📁" },
            { label: "Commits", value: "500+", icon: "💻" },
            { label: "Stars", value: "10+", icon: "⭐" },
        ],
        highlights: [
            "GitHub: github.com/Vandan1423",
            "LinkedIn: linkedin.com/in/vandan-nagori",
            "Open to collaboration",
            "Available for Summer 2025 Internship",
        ],
        links: [
            { label: "GitHub", url: "https://github.com/Vandan1423" },
            {
                label: "LinkedIn",
                url: "https://www.linkedin.com/in/vandan-nagori",
            },
            { label: "Email", url: "mailto:vandannagori@gmail.com" },
        ],
        color: "#f39c12",
    },
};

/**
 * Get planet data by name
 * @param {string} planetName - Name of the planet
 * @returns {object|null} - Planet section data or null if not found
 */
export const getPlanetData = (planetName) => {
    return planetSectionData[planetName] || null;
};

/**
 * Get all planet names
 * @returns {string[]} - Array of planet names
 */
export const getAllPlanetNames = () => {
    return Object.keys(planetSectionData);
};

export default planetSectionData;
