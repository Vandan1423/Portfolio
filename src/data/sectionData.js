/**
 * Section Data for All Star Systems
 *
 * This file contains detailed information for each planet/section across all star systems.
 * Each section corresponds to a planet in the star system and displays specific content
 * when the user visits that planet's detail view.
 *
 * Structure:
 * - Organized by star system ID
 * - Each system contains sections mapped by sectionId
 * - Each section has: title, subtitle, description, details, stats, highlights, links, etc.
 */

export const sectionData = {
    /**
     * ===============================================
     * ALPHA CENTAURI - About Me Page (7 sections)
     * ===============================================
     */
    "alpha-centauri": {
        "personal-info": {
            title: "Personal Information",
            subtitle: "The Explorer Behind the Code",
            description:
                "Third-year undergraduate at IIT Indore with a passion for building meaningful web applications. I specialize in full-stack development, creating solutions that combine intuitive user interfaces with robust backend systems.",
            details: [
                { label: "Name", value: "Vandan Nagori" },
                { label: "Role", value: "Full-Stack Developer" },
                { label: "Location", value: "IIT Indore, India" },
                { label: "Email", value: "nagori.vandan04@gmail.com" },
                { label: "Phone", value: "+91-7372972514" },
            ],
            stats: [
                { label: "Year", value: "3rd", icon: "🎓" },
                { label: "CGPA", value: "8.58", icon: "📊" },
                { label: "Projects", value: "4+", icon: "🚀" },
            ],
            highlights: [
                "Pursuing B.Tech in Space Science & Engineering",
                "Full-Stack Developer with MERN expertise",
                "Head of Web Development - Astronomy Club",
                "Head of Technicals - Gaming Club",
            ],
            links: [
                { label: "GitHub", url: "https://github.com/Vandan1423" },
                { label: "LinkedIn", url: "https://www.linkedin.com/in/vandan-nagori-140a132b2/" },
            ],
            color: "#4ade80",
        },

        "education": {
            title: "Education",
            subtitle: "Academic Journey",
            description:
                "Currently pursuing B.Tech in Space Science and Engineering at IIT Indore, one of India's premier technical institutions. Strong academic foundation with focus on technical excellence.",
            details: [
                { label: "Institute", value: "IIT Indore" },
                { label: "Degree", value: "B.Tech" },
                { label: "Major", value: "Space Science & Engineering" },
                { label: "Year", value: "2023 - Present" },
                { label: "CGPA", value: "8.58" },
            ],
            stats: [
                { label: "CGPA", value: "8.58", icon: "📊" },
                { label: "Senior Sec", value: "93.2%", icon: "📚" },
                { label: "Secondary", value: "86.2%", icon: "📖" },
            ],
            highlights: [
                "B.Tech Space Science & Engineering - IIT Indore",
                "Senior Secondary (CBSE) - 93.2%",
                "Secondary (CBSE) - 86.2%",
                "Strong foundation in Mathematics and Physics",
            ],
            color: "#60a5fa",
        },

        "interests": {
            title: "Interests & Hobbies",
            subtitle: "Beyond the Code",
            description:
                "When I'm not coding, I explore diverse interests that keep me balanced and creative. From playing piano to competitive gaming, each hobby contributes to my problem-solving abilities.",
            details: [
                { label: "Music", value: "Piano" },
                { label: "Sports", value: "Cricket" },
                { label: "Gaming", value: "E-Sports" },
                { label: "Astronomy", value: "Stargazing" },
            ],
            stats: [
                { label: "Clubs", value: "2", icon: "🎯" },
                { label: "Instruments", value: "1", icon: "🎹" },
                { label: "Hobbies", value: "4+", icon: "🎮" },
            ],
            highlights: [
                "Piano - Creating melodies and harmonies",
                "Cricket - Team spirit and strategy",
                "E-Sports - Competitive gaming passion",
                "Music - Exploring diverse genres",
            ],
            color: "#c084fc",
        },

        "tech-stack": {
            title: "Tech Stack",
            subtitle: "Technical Arsenal",
            description:
                "A comprehensive toolkit spanning frontend frameworks, backend technologies, databases, and development tools. Continuously expanding knowledge with modern technologies and best practices.",
            details: [
                { label: "Primary Stack", value: "MERN" },
                { label: "Frontend", value: "React, Tailwind" },
                { label: "Backend", value: "Node.js, Express" },
                { label: "Database", value: "MongoDB, SQL" },
                { label: "Languages", value: "JS, Python, C++" },
            ],
            stats: [
                { label: "Frontend", value: "90%", icon: "🎨" },
                { label: "Backend", value: "85%", icon: "⚙️" },
                { label: "Tools", value: "80%", icon: "🔧" },
            ],
            highlights: [
                "React.js & React Three Fiber",
                "Node.js & Express.js",
                "MongoDB & Mongoose ODM",
                "Tailwind CSS & Bootstrap",
                "Git/GitHub, Vercel, Cloudinary",
            ],
            color: "#14b8a6",
        },

        "achievements": {
            title: "Achievements",
            subtitle: "Milestones & Accomplishments",
            description:
                "A collection of notable achievements, research experiences, and competitions that have shaped my journey as a developer and problem solver at IIT Indore.",
            details: [
                { label: "Research", value: "PRIUS Fellowship" },
                { label: "Competition", value: "ISRO-NRSC Challenge" },
                { label: "Leadership", value: "2 Club Head Positions" },
                { label: "Projects", value: "4+ Live Websites" },
            ],
            stats: [
                { label: "Research", value: "1", icon: "🔬" },
                { label: "Awards", value: "3+", icon: "🏆" },
                { label: "Leadership", value: "2", icon: "👑" },
            ],
            highlights: [
                "PRIUS Fellowship - Galaxy Classification Research",
                "ISRO-NRSC National Challenge Participant",
                "Head of Web Development - Astronomy Club",
                "Head of Technicals - Gaming Club",
            ],
            color: "#f59e0b",
        },

        "resume": {
            title: "Resume",
            subtitle: "Professional Profile",
            description:
                "Comprehensive resume showcasing education, technical skills, projects, experience, and achievements. Available for download and viewing.",
            details: [
                { label: "Format", value: "PDF" },
                { label: "Sections", value: "7" },
                { label: "Updated", value: "2024" },
                { label: "Size", value: "~ 2 pages" },
            ],
            stats: [
                { label: "Projects", value: "4+", icon: "🚀" },
                { label: "Experience", value: "5", icon: "💼" },
                { label: "Skills", value: "15+", icon: "🛠️" },
            ],
            highlights: [
                "Complete professional profile",
                "Education: IIT Indore - Space Science & Engineering",
                "Technical Skills: MERN Stack & More",
                "Projects, Experience, and Certifications",
            ],
            links: [
                { label: "View Resume", url: "/resume/CV_Tech.pdf" },
                { label: "Download PDF", url: "/resume/CV_Tech.pdf" },
            ],
            color: "#8b5cf6",
        },

        "certifications": {
            title: "Certifications",
            subtitle: "Professional Training & Courses",
            description:
                "Professional certifications and completed courses demonstrating continuous learning and skill development in web development and related technologies.",
            details: [
                { label: "Course", value: "Web Development - Delta Batch" },
                { label: "Organization", value: "Apna College" },
                { label: "Year", value: "2024" },
                { label: "Status", value: "Completed" },
            ],
            stats: [
                { label: "Courses", value: "1", icon: "📜" },
                { label: "Hours", value: "100+", icon: "⏱️" },
                { label: "Tech", value: "10+", icon: "💻" },
            ],
            highlights: [
                "Web Development - Delta Batch (Apna College)",
                "Comprehensive full-stack development certification",
                "Technologies: React, Node.js, MongoDB, Express",
                "Hands-on projects and real-world applications",
            ],
            color: "#ec4899",
        },
    },

    /**
     * ===============================================
     * SIRIUS - Projects Page (4 projects)
     * ===============================================
     */
    "sirius": {
        "project-1": {
            title: "Airbnb Replica",
            subtitle: "Full-Stack Rental Marketplace",
            description:
                "Full-featured, full-stack rental platform using Node.js, Express.js, MongoDB, and EJS. Implements user authentication and authorization, property listings, bookings, and a review system with MVC architecture for RESTful APIs.",
            details: [
                { label: "Status", value: "Live" },
                { label: "Type", value: "Full-Stack Web App" },
                { label: "Role", value: "Solo Developer" },
                { label: "Deployment", value: "Render" },
            ],
            stats: [
                { label: "Features", value: "5+", icon: "⚡" },
                { label: "Tech Stack", value: "5", icon: "🔧" },
                { label: "Status", value: "Live", icon: "🟢" },
            ],
            highlights: [
                "User Authentication and Authorization",
                "Property Listings and Booking System",
                "Review System for Properties",
                "MVC Architecture for RESTful APIs",
                "Full Server/Client-Side Validations with CRUD Operations",
                "Deployed on Render with MongoDB Atlas Cloud",
            ],
            links: [
                { label: "Live Demo", url: "https://airbnb-replica-six.vercel.app/" },
                { label: "GitHub", url: "https://github.com/Vandan1423/AirBnb_Replica" },
            ],
            color: "#3b82f6",
        },

        "project-2": {
            title: "Gaming Club Website",
            subtitle: "IIT Indore Official Club Platform",
            description:
                "Led the development of the Gaming Club website using React.js, Node.js, Express.js, HTML, CSS, and JavaScript. Deployed and maintained using Git and Vercel, ensuring consistent uptime and performance with dynamic content updates.",
            details: [
                { label: "Status", value: "Live" },
                { label: "Type", value: "Club Website" },
                { label: "Role", value: "Lead Developer" },
                { label: "Deployment", value: "Vercel" },
            ],
            stats: [
                { label: "Features", value: "5+", icon: "⚡" },
                { label: "Uptime", value: "99%+", icon: "✅" },
                { label: "Status", value: "Live", icon: "🟢" },
            ],
            highlights: [
                "Built with React.js, Node.js, Express.js",
                "Deployed and Maintained using Git and Vercel",
                "Dynamic Content Updates",
                "User-Friendly Interface Improvements",
                "Consistent Uptime and Performance",
            ],
            links: [
                { label: "Live Website", url: "https://gaming-club-iiti.vercel.app/" },
                { label: "GitHub", url: "https://github.com/Vandan1423/Gaming-Club-IITI" },
            ],
            color: "#8b5cf6",
        },

        "project-3": {
            title: "Astronomy Club Website",
            subtitle: "IIT Indore Astronomy Platform",
            description:
                "Built and deployed the official Astronomy Club website using React.js and Node.js, hosted on Vercel. Developed responsive UI components ensuring cross-device compatibility with regular content updates and new sections as per event needs.",
            details: [
                { label: "Status", value: "Live" },
                { label: "Type", value: "Club Website" },
                { label: "Role", value: "Head of Web Dev" },
                { label: "Deployment", value: "Vercel" },
            ],
            stats: [
                { label: "Features", value: "6+", icon: "⚡" },
                { label: "Uptime", value: "99%", icon: "✅" },
                { label: "Status", value: "Live", icon: "🟢" },
            ],
            highlights: [
                "Built with React.js and Node.js",
                "Hosted on Vercel",
                "Responsive UI Components",
                "Cross-Device Compatibility",
                "Regular Content Updates and New Sections",
            ],
            links: [
                { label: "Live Website", url: "https://astronomy-club-iit-indore.vercel.app/" },
                { label: "GitHub", url: "https://github.com/AstronomyClubIITIndore/AstronomyClub_IITIndore" },
            ],
            color: "#06b6d4",
        },

        "project-4": {
            title: "Academic Portal",
            subtitle: "Full-Stack Student & Faculty Platform",
            description:
                "Full-stack academic portal enabling faculty and student login/signup with separate dashboards. Students view timetables, quizzes, grades, and homework, while faculty upload materials and resources with real-time updates.",
            details: [
                { label: "Status", value: "Completed" },
                { label: "Type", value: "Full-Stack Web App" },
                { label: "Role", value: "Solo Developer" },
                { label: "Users", value: "Faculty & Students" },
            ],
            stats: [
                { label: "Features", value: "8+", icon: "⚡" },
                { label: "Portals", value: "2", icon: "👥" },
                { label: "Tech Stack", value: "5", icon: "🔧" },
            ],
            highlights: [
                "Dual Portal System (Student & Faculty)",
                "Student Dashboard: Timetable, Quizzes, Grades, Homework",
                "Faculty Dashboard: Upload Materials, Quizzes, Resources",
                "Real-time Updates with MongoDB",
                "Built with Node.js, Express.js, EJS, and MongoDB",
            ],
            links: [
                { label: "GitHub", url: "https://github.com/Vandan1423/Academic-Portal" },
            ],
            color: "#10b981",
        },
    },

    /**
     * ===============================================
     * VEGA - Experience Page (5 experiences)
     * ===============================================
     */
    "vega": {
        "exp-01": {
            title: "Head of Web Development",
            subtitle: "Astronomy Club, IIT Indore",
            description:
                "Leading web development initiatives for the Astronomy Club, managing the official website and overseeing all digital presence to serve the astronomy enthusiast community.",
            details: [
                { label: "Duration", value: "July 2023 - July 2025" },
                { label: "Type", value: "Leadership" },
                { label: "Location", value: "IIT Indore" },
                { label: "Status", value: "Current" },
            ],
            stats: [
                { label: "Uptime", value: "99%+", icon: "✅" },
                { label: "Team", value: "5+", icon: "👥" },
                { label: "Features", value: "10+", icon: "🚀" },
            ],
            highlights: [
                "Lead development using React.js and Tailwind CSS",
                "Manage website deployment on Vercel",
                "Mentor junior team members",
                "Coordinate with design team for visual consistency",
            ],
            links: [
                { label: "Website", url: "https://astronomy-club-iit-indore.vercel.app/" },
                { label: "GitHub", url: "https://github.com/AstronomyClubIITIndore/AstronomyClub_IITIndore" },
            ],
            color: "#a855f7",
        },

        "exp-02": {
            title: "Head of Technicals",
            subtitle: "Gaming Club, IIT Indore",
            description:
                "Leading technical operations for the Gaming Club, overseeing website development, managing technical infrastructure for gaming events, and coordinating tournament logistics.",
            details: [
                { label: "Duration", value: "Dec 2024 - April 2025" },
                { label: "Type", value: "Leadership" },
                { label: "Location", value: "IIT Indore" },
                { label: "Status", value: "Current" },
            ],
            stats: [
                { label: "Events", value: "10+", icon: "🎮" },
                { label: "Users", value: "500+", icon: "👥" },
                { label: "Team", value: "8+", icon: "👨‍💻" },
            ],
            highlights: [
                "Oversee website development and maintenance",
                "Lead development team for tournament systems",
                "Manage technical infrastructure for live events",
                "Implement real-time registration portal",
            ],
            links: [
                { label: "Website", url: "https://gaming-club-iiti.vercel.app/" },
                { label: "GitHub", url: "https://github.com/Vandan1423/Gaming-Club-IITI" },
            ],
            color: "#ec4899",
        },

        "exp-03": {
            title: "PRIUS Fellowship",
            subtitle: "Galaxy Classification Research",
            description:
                "Worked under PRIUS program to classify galaxies as passive or star-forming using COSMOS survey data. Used EAZY-py for photometric redshift estimation via template fitting and generated UVJ diagrams with comprehensive preprocessing and analysis.",
            details: [
                { label: "Duration", value: "Summer 2024" },
                { label: "Type", value: "Research Fellowship" },
                { label: "Field", value: "Astronomy & ML" },
                { label: "Status", value: "Completed" },
            ],
            stats: [
                { label: "Duration", value: "3 mo", icon: "📅" },
                { label: "Data", value: "COSMOS", icon: "🌌" },
                { label: "Methods", value: "ML", icon: "🎯" },
            ],
            highlights: [
                "Galaxy Classification: Passive vs Star-Forming",
                "COSMOS Survey Data Analysis",
                "EAZY-py for Photometric Redshift Estimation",
                "UVJ Diagram Generation via Template Fitting",
                "Preprocessing, Parameter Tuning, and Output Analysis",
            ],
            color: "#8b5cf6",
        },

        "exp-04": {
            title: "ISRO-NRSC National Challenge",
            subtitle: "Cloud & Shadow Detection",
            description:
                "Participated in ISRO-NRSC national challenge for cloud and shadow detection using TOA reflectance data. Performed preprocessing (reflectance conversion, masking) and applied UNet-based ML segmentation with optimized training pipelines.",
            details: [
                { label: "Year", value: "2024" },
                { label: "Type", value: "National Competition" },
                { label: "Field", value: "Remote Sensing & ML" },
                { label: "Status", value: "Completed" },
            ],
            stats: [
                { label: "Algorithm", value: "UNet", icon: "🤖" },
                { label: "Duration", value: "2 mo", icon: "📅" },
                { label: "Data", value: "TOA", icon: "🛰️" },
            ],
            highlights: [
                "Cloud and Shadow Detection using TOA Reflectance Data",
                "Preprocessing: Reflectance Conversion and Masking",
                "UNet-based ML Segmentation",
                "Developed and Optimized Training Pipelines",
                "Accurate Detection and Evaluation",
            ],
            color: "#06b6d4",
        },

        "exp-05": {
            title: "Web Development Certification",
            subtitle: "Delta Batch - Apna College",
            description:
                "Comprehensive full-stack web development certification covering modern technologies including React, Node.js, MongoDB, Express, and more. Completed with hands-on projects.",
            details: [
                { label: "Year", value: "2024" },
                { label: "Organization", value: "Apna College" },
                { label: "Type", value: "Certification" },
                { label: "Status", value: "Completed" },
            ],
            stats: [
                { label: "Hours", value: "100+", icon: "⏱️" },
                { label: "Projects", value: "10+", icon: "🚀" },
                { label: "Tech", value: "10+", icon: "💻" },
            ],
            highlights: [
                "Full-stack web development certification",
                "Technologies: React, Node.js, MongoDB, Express",
                "10+ hands-on projects completed",
                "Comprehensive coverage of modern web technologies",
            ],
            color: "#10b981",
        },
    },

    /**
     * ===============================================
     * BETELGEUSE - Contact Page (2 sections)
     * ===============================================
     */
    "betelgeuse": {
        "contact-form": {
            title: "Send Message",
            subtitle: "Get In Touch",
            description:
                "Have a project in mind or want to collaborate? Send me a message and I'll get back to you as soon as possible. Let's create something amazing together!",
            details: [
                { label: "Response Time", value: "24-48 hours" },
                { label: "Availability", value: "Open for opportunities" },
                { label: "Preferred", value: "Email" },
            ],
            stats: [
                { label: "Response", value: "< 48h", icon: "⏱️" },
                { label: "Projects", value: "Open", icon: "💼" },
                { label: "Collab", value: "Yes", icon: "🤝" },
            ],
            highlights: [
                "Quick response within 24-48 hours",
                "Open for internship opportunities",
                "Available for freelance projects",
                "Ready to collaborate on interesting ideas",
            ],
            color: "#f97316",
        },

        "contact-info": {
            title: "Contact Information",
            subtitle: "Ways to Reach Me",
            description:
                "Find me across the digital universe. Connect on professional networks, check out my projects on GitHub, or reach out directly via email or phone.",
            details: [
                { label: "Email", value: "nagori.vandan04@gmail.com" },
                { label: "Phone", value: "+91-7372972514" },
                { label: "Location", value: "IIT Indore, India" },
                { label: "Availability", value: "Summer 2025 Intern" },
            ],
            stats: [
                { label: "GitHub", value: "15+", icon: "📁" },
                { label: "LinkedIn", value: "500+", icon: "🔗" },
                { label: "Projects", value: "4+", icon: "🚀" },
            ],
            highlights: [
                "Email: nagori.vandan04@gmail.com",
                "Phone: +91-7372972514",
                "Location: IIT Indore, Madhya Pradesh, India",
                "Seeking Summer 2025 Internship Opportunities",
            ],
            links: [
                { label: "GitHub", url: "https://github.com/Vandan1423" },
                { label: "LinkedIn", url: "https://www.linkedin.com/in/vandan-nagori-140a132b2/" },
                { label: "Email", url: "mailto:nagori.vandan04@gmail.com" },
            ],
            color: "#fb923c",
        },
    },

    /**
     * ===============================================
     * RIGEL - Technologies Page (3 categories)
     * ===============================================
     */
    "rigel": {
        "frontend": {
            title: "Frontend Development",
            subtitle: "User Interface & Client-Side",
            description:
                "Expertise in building modern, responsive, and interactive user interfaces using React, JavaScript, HTML5, CSS3, and popular UI frameworks like Tailwind CSS and Bootstrap.",
            details: [
                { label: "Primary", value: "React.js" },
                { label: "Styling", value: "Tailwind CSS" },
                { label: "Language", value: "JavaScript ES6+" },
                { label: "Proficiency", value: "90%" },
            ],
            stats: [
                { label: "Proficiency", value: "90%", icon: "📊" },
                { label: "Projects", value: "4+", icon: "🚀" },
                { label: "Experience", value: "2 yrs", icon: "⏱️" },
            ],
            highlights: [
                "React.js & React Three Fiber",
                "JavaScript (ES6+)",
                "HTML5 & CSS3",
                "Tailwind CSS & Bootstrap",
                "Responsive Design & Mobile-First Approach",
            ],
            color: "#14b8a6",
        },

        "backend": {
            title: "Backend Development",
            subtitle: "Server-Side & APIs",
            description:
                "Strong backend development skills with Node.js and Express.js for building RESTful APIs, handling authentication, and managing server-side logic with MongoDB integration.",
            details: [
                { label: "Primary", value: "Node.js" },
                { label: "Framework", value: "Express.js" },
                { label: "Database", value: "MongoDB" },
                { label: "Proficiency", value: "85%" },
            ],
            stats: [
                { label: "Proficiency", value: "85%", icon: "📊" },
                { label: "APIs", value: "10+", icon: "🔌" },
                { label: "Experience", value: "2 yrs", icon: "⏱️" },
            ],
            highlights: [
                "Node.js & Express.js",
                "MongoDB & Mongoose ODM",
                "RESTful API Design",
                "Authentication with Passport.js",
                "Session Management & Security",
            ],
            color: "#0d9488",
        },

        "tools": {
            title: "Tools & DevOps",
            subtitle: "Development Workflow & Deployment",
            description:
                "Proficient with modern development tools and workflows including Git/GitHub for version control, Vercel for deployment, and Cloudinary for media management.",
            details: [
                { label: "Version Control", value: "Git/GitHub" },
                { label: "Deployment", value: "Vercel" },
                { label: "Media", value: "Cloudinary" },
                { label: "Proficiency", value: "80%" },
            ],
            stats: [
                { label: "Proficiency", value: "80%", icon: "📊" },
                { label: "Tools", value: "10+", icon: "🔧" },
                { label: "Deployments", value: "4+", icon: "🚀" },
            ],
            highlights: [
                "Git/GitHub for Version Control",
                "Vercel for Deployment",
                "Cloudinary for Media Management",
                "VS Code & Development Tools",
                "Postman for API Testing",
            ],
            color: "#06b6d4",
        },
    },

    /**
     * ===============================================
     * POLARIS - Journey Page (2 sections)
     * ===============================================
     */
    "polaris": {
        "journey-milestones": {
            title: "Career Milestones",
            subtitle: "Key Achievements & Journey",
            description:
                "A timeline of significant milestones in my journey as a developer, from learning to code to leading technical teams and building production applications.",
            details: [
                { label: "Started", value: "2023" },
                { label: "Projects", value: "4+ Live" },
                { label: "Leadership", value: "2 Positions" },
                { label: "Experience", value: "5 Roles" },
            ],
            stats: [
                { label: "Years", value: "2+", icon: "📅" },
                { label: "Milestones", value: "10+", icon: "🎯" },
                { label: "Growth", value: "200%", icon: "📈" },
            ],
            highlights: [
                "Started coding journey in 2023",
                "Built 4+ production-ready applications",
                "Became Head of Web Dev - Astronomy Club",
                "Led technical team for Gaming Club",
            ],
            color: "#6366f1",
        },

        "journey-achievements": {
            title: "Achievements & Recognition",
            subtitle: "Awards & Accomplishments",
            description:
                "Collection of achievements, awards, and recognitions received throughout my academic and professional journey, showcasing excellence and dedication.",
            details: [
                { label: "Research", value: "PRIUS Fellowship" },
                { label: "Competition", value: "ISRO-NRSC" },
                { label: "Academic", value: "8.58 CGPA" },
                { label: "Leadership", value: "2 Head Positions" },
            ],
            stats: [
                { label: "Awards", value: "3+", icon: "🏆" },
                { label: "CGPA", value: "8.58", icon: "📊" },
                { label: "Recognition", value: "5+", icon: "⭐" },
            ],
            highlights: [
                "PRIUS Fellowship for Galaxy Classification",
                "ISRO-NRSC National Challenge",
                "Academic Excellence - 8.58 CGPA at IIT Indore",
                "Leadership Recognition in 2 Technical Clubs",
            ],
            color: "#818cf8",
        },
    },
};

/**
 * Get section data by star system ID and section ID
 * @param {string} systemId - Star system ID (e.g., "alpha-centauri")
 * @param {string} sectionId - Section ID (e.g., "personal-info")
 * @returns {object|null} - Section data or null if not found
 */
export const getSectionData = (systemId, sectionId) => {
    if (!systemId || !sectionId) return null;
    return sectionData[systemId]?.[sectionId] || null;
};

/**
 * Get all sections for a star system
 * @param {string} systemId - Star system ID
 * @returns {object} - All sections for the system
 */
export const getSystemSections = (systemId) => {
    return sectionData[systemId] || {};
};

export default sectionData;
