export const skillCategories = [
    {
        category: "Frontend Development",
        icon: "FaReact",
        skills: [
            { name: "React.js" },
            { name: "JavaScript (ES6+)" },
            { name: "HTML5" },
            { name: "CSS3" },
            { name: "Tailwind CSS" },
            { name: "Bootstrap" },
            { name: "Redux" },
            { name: "EJS" },
        ],
    },
    {
        category: "Backend Development",
        icon: "FaServer",
        skills: [
            { name: "Node.js"},
            { name: "Express.js"},
            { name: "RESTful APIs"},
        ],
    },
    {
        category: "Database",
        icon: "FaDatabase",
        skills: [
            { name: "MongoDB"},
            { name: "Mongoose ODM"},
            { name: "SQL"},
        ],
    },
    {
        category: "Programming Languages",
        icon: "FaCode",
        skills: [
            { name: "JavaScript"},
            { name: "Java"},
            { name: "Python"},
        ],
    },
    {
        category: "Tools & Version Control",
        icon: "FaGitAlt",
        skills: [
            { name: "Git/GitHub"},
            { name: "VS Code"},
            { name: "Terminal/CLI"},
            { name: "npm/npx"},
        ],
    },
    {
        category: "Currently Learning",
        icon: "FaLightbulb",
        skills: [
            { name: "TypeScript"},
            { name: "Next.js"},
            { name: "Docker"},
        ],
    },
];

// Helper functions
export const allSkills = skillCategories.flatMap((cat) => cat.skills);