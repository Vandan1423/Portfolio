export const projects = [
    {
        id: 1,
        title: "AirBnb Replica",
        tagline: "Full-featured rental marketplace platform",
        description:
            "Full-featured rental marketplace platform with complete booking management, user authentication, and interactive mapping functionality.",
        features: [
            "Secure Authentication System - Passport.js-based session authentication with user registration and login",
            "Complete Listing Management - Users can create, edit, and delete property listings with image uploads via Cloudinary",
            "Review & Rating System - Authenticated users can leave reviews and ratings on listings",
            "Interactive Maps Integration - Integrated location mapping with navigation support for property locations",
            "Role-Based Authorization - Listing owners have exclusive edit/delete permissions for their properties",
        ],
        technologies: [
            "MongoDB",
            "Express.js",
            "Node.js",
            "EJS",
            "Bootstrap",
            "CSS3",
            "Joi",
            "Express Sessions",
            "Passport.js",
            "Cloudinary",
            "JavaScript",
        ],
        category: "Full-Stack",
        github: "https://github.com/Vandan1423/AirBnb_Replica",
        demo: "https://airbnb-replica-6024.onrender.com/",
        image: "/images/projects/airbnb.jpg",
        featured: true,
        role: "Solo Developer",
        challenges:
            "Implementing secure role-based authorization ensuring only listing owners could modify their properties while maintaining seamless user experience. Integrating Cloudinary for efficient image upload and storage with proper validation and error handling.",
        impact: "Successfully built a production-ready rental platform demonstrating full CRUD operations, RESTful API design, and MVC architecture. Implemented comprehensive authentication with session management and deployed a fully functional application with cloud-based image storage.",
    },
    {
        id: 2,
        title: "Gaming Club Website - IIT Indore",
        tagline: "Official Gaming Club platform",
        description:
            "Official Gaming Club website featuring tournament management, event registration, and member directory serving the IIT Indore gaming community.",
        features: [
            "Tournament Management System - Live tournament registration portal with active, upcoming, and past tournament tracking",
            "Event Registration Portal - Integrated sign-up system allowing students to register for tournaments directly through the website",
            "Dynamic Event Gallery - Photo gallery showcasing past gaming events and competitions with responsive image grids",
            "Member Directory & Contact - Comprehensive team page with member profiles and direct contact functionality",
            "Responsive Modern UI - Mobile-first design ensuring seamless experience across all devices",
        ],
        technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "Express.js"],
        category: "Frontend",
        github: "https://github.com/DigitalDiplomacy/gamingclubiiti",
        demo: "https://gamingclub.vercel.app/",
        image: "/images/projects/gaming-club.jpg",
        featured: true,
        role: "Frontend Developer & Team Coordinator",
        challenges:
            "Coordinating with multiple team members to maintain consistent design language across pages while implementing complex responsive layouts. Ensuring tournament registration system integrated smoothly with backend and provided real-time feedback to users.",
        impact: "Launched official website serving IIT Indore's gaming community with active tournament participation tracking. Created intuitive user interface that streamlined event registration and improved member engagement with club activities.",
    },
    {
        id: 3,
        title: "Astronomy Club Website - IIT Indore",
        tagline: "Space-themed club platform",
        description:
            "Official Astronomy Club website showcasing research projects, astronomy news, and club activities with an immersive space-themed user experience.",
        features: [
            "Interactive Loading Experience - Custom 3D Earth rotation loader creating an engaging entry animation",
            "Research Projects Showcase - Dedicated section highlighting ongoing astronomy and astrophysics research initiatives",
            "Live Astronomy News Feed - Curated news section featuring latest updates in astronomy and astrophysics",
            "Activities & Events Timeline - Comprehensive display of club activities including stargazing sessions, workshops, and seminars",
            "Interactive Team Directory - Member profile cards with role designations and contact information",
        ],
        technologies: ["React.js", "Tailwind CSS", "JavaScript", "Vercel"],
        category: "Frontend",
        github: "https://github.com/AstronomyClubIITIndore/AstronomyClub_IITIndore",
        demo: "https://astronomy-club-iit-indore.vercel.app/",
        image: "/images/projects/astronomy-club.jpg",
        featured: true,
        role: "Head of Web Development",
        challenges:
            "Inheriting and refactoring existing codebase while maintaining backwards compatibility and improving UI/UX.",
        impact: "Successfully improved website aesthetics and user experience with better engagement from club members and visitors.",
    },
    {
        id: 4,
        title: "EduConnect - Academic Portal",
        tagline: "Comprehensive academic management system",
        description:
            "Comprehensive academic management system featuring dual role-based portals for students and faculty with real-time scheduling and resource management.",
        features: [
            "Dual Role Authentication - Separate login portals and dashboards for students and faculty with secure session management",
            "Dynamic Timetable Management - Real-time class schedules with next-class indicators, weekly views, and automatic updates",
            "Resource Management System - Faculty can upload and organize educational materials including documents, presentations, videos, and quizzes",
            "Student Analytics Dashboard - Performance metrics, attendance tracking, and grade-wise analytics for faculty insights",
            "Grade-Based Content Filtering - Automatic content delivery system based on student grade levels (9-12)",
        ],
        technologies: [
            "Node.js",
            "Express.js",
            "MongoDB",
            "Mongoose",
            "JavaScript",
            "CSS3",
            "EJS",
            "Bcrypt.js",
            "Express Session",
        ],
        category: "Full-Stack",
        github: "https://github.com/Vandan1423/Academic-Portal",
        demo: null,
        image: "/images/projects/educonnect.jpg",
        featured: false,
        role: "Solo Developer",
        challenges:
            "Implementing role-based access control with separate session management for students and faculty while maintaining a unified authentication flow. Designing a flexible timetable system that dynamically updates based on current day and time, ensuring data integrity across different user roles.",
        impact: "Built comprehensive dual-portal system supporting 4 grade levels with secure authentication and scalable MongoDB schema.",
    },
    {
        id: 5,
        title: "Simon Says Game",
        tagline: "Interactive memory challenge game",
        description:
            "Interactive memory-based game where players must replicate increasingly complex color sequences. Features progressive difficulty with visual feedback and score tracking.",
        features: [
            "Progressive Difficulty System - Each level adds one more step to the sequence, increasing complexity as players advance",
            "Visual Feedback System - Smooth color card animations with blinking effects for both game sequences and user interactions",
            "Score Tracking - Real-time score display showing current level and total points accumulated during gameplay",
            "Game State Management - Start, restart, and quit controls with proper game state handling and sequence validation",
            "Multi-Color Pattern System - Six-color game board (red, green, yellow, pink, plum, aqua) with random sequence generation",
            "Error Feedback - Red flashing background animation when player makes an incorrect move",
        ],
        technologies: ["HTML5", "CSS3", "JavaScript"],
        category: "Front-End",
        github: "https://github.com/Vandan1423/simonsaysgame",
        demo: "https://simonsaysgame-omega.vercel.app/",
        image: "/images/projects/simon-says.jpg",
        featured: false,
        role: "Solo Developer",
        challenges:
            "Implementing sequence validation logic that accurately compares user input with generated patterns in real-time. Managing asynchronous card animations with proper timing delays to ensure the sequence displays clearly before user interaction. Handling game state transitions smoothly between different phases (idle, playing, game over).",
        impact: "Created an engaging browser-based memory game with progressive difficulty that challenges players' pattern recognition and memory skills through an intuitive visual interface.",
    },
];

// Helper functions
export const getFeaturedProjects = () => {
    return projects.filter((project) => project.featured);
};

export const getProjectsByCategory = (category) => {
    if (category === "All") return projects;
    return projects.filter((project) => project.category === category);
};

export const getProjectById = (id) => {
    return projects.find((project) => project.id === parseInt(id));
};
