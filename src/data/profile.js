/**
 * profile.js: every fact about me, in one place.
 *
 * This is the only file to edit when something changes. The pages, the 3D
 * planet panels and the page's <meta> tags all read from here.
 *
 * - Plain text only, no HTML.
 * - Set a field to null to hide it. Delete a list item to remove it.
 * - Links are full URLs, or paths starting with "/" for files in /public.
 * - The order of each list is the order shown on the site.
 */

// ── About me ────────────────────────────────────────────────────────────────

export const person = {
    name: "Vandan Nagori",
    role: "Full-stack developer",
    headline: "Full-stack developer and B.Tech student at IIT Indore",
    bio: "",
    location: "Indore, India",
    email: "nagori.vandan04@gmail.com",
};

export const links = {
    github: "https://github.com/Vandan1423",
    linkedin: "https://www.linkedin.com/in/vandan-nagori-140a132b2/",
    resume: "/resume/CV_Tech.pdf",
    website: "https://vandan-nagori.vercel.app/",
};

// ── Education ───────────────────────────────────────────────────────────────

export const education = {
    degree: "B.Tech, Space Science and Engineering",
    school: "Indian Institute of Technology Indore",
    years: "2023 – present",
    cgpa: "8.83",
    schooling: [
        { name: "Senior Secondary (CBSE)", score: "93.2%", year: "2022" },
        { name: "Secondary (CBSE)", score: "86.2%", year: "2020" },
    ],
};

// ── Experience ──────────────────────────────────────────────────────────────
// id:       short name used in links and the 3D map. Keep it lowercase, no spaces.
// projects: optional, for named pieces of work inside one role.

export const experience = [
    {
        id: "arihant",
        role: "Frontend Developer Intern (Flutter & React)",
        org: "Arihant Capital Markets Ltd.",
        location: "Indore",
        start: "Jun 2026",
        end: "Aug 2026",
        summary: "Built the frontends of three investing and research tools.",
        projects: [
            {
                name: "Goal Planner",
                text: "Flutter app (Riverpod) for goal-based mutual fund investing: risk profiling, goal creation, corpus projection, fund recommendations and Finfactor holdings import.",
                link: "https://drive.google.com/file/d/16POumxSbP06lW2oUotRshi4Xi7wh3Zjn/view?usp=sharing",
            },
            {
                name: "Equity Fund Scoring Dashboard",
                text: "React dashboard that ranks 1,300+ Indian equity funds on 13 parameters.",
                link: "https://uat-acmlwealth.arihantplus.com",
            },
            {
                name: "Finance Research Chatbot",
                text: "React frontend for a RAG chatbot over research PDFs and live market data.",
                link: null,
            },
        ],
        stack: ["Flutter", "Riverpod", "React"],
        links: [
            {
                label: "Certificate (rated 9/10)",
                url: "https://drive.google.com/file/d/1I1ocEWAYx2aDaVd0WTkATK-l35IHOxfh/view?usp=sharing",
            },
        ],
    },
    {
        id: "prius",
        role: "Undergraduate Research Fellow",
        org: "PRIUS Fellowship, IIT Indore",
        location: "Indore",
        start: "Feb 2025",
        end: "Aug 2025",
        summary:
            "Estimated redshifts of COSMOS galaxies and sorted them into star-forming and passive.",
        points: [
            "Built a Python (EAZY-py) pipeline that estimates photometric redshifts by SED fitting.",
            "Tuned the fitting parameters and made UVJ diagrams to classify each galaxy.",
        ],
        stack: ["Python", "EAZY-py"],
        links: [
            {
                label: "Office memorandum",
                url: "https://drive.google.com/file/d/1XdxJIdjCT5n574wG03sW9yLWlCtAiz4K/view?usp=sharing",
            },
        ],
    },
];

// Club roles. Shown on the Experience page under "Positions of responsibility".
export const positions = [
    {
        id: "astronomy-club",
        role: "Head of Web Development",
        org: "Astronomy Club, IIT Indore",
        start: "Jul 2024",
        end: "Jul 2025",
        summary: "Led the web team and its code reviews.",
        stack: ["React", "Tailwind CSS"],
        links: [
            {
                label: "Club website",
                url: "https://astronomy-club-iit-indore.vercel.app/",
            },
        ],
    },
    {
        id: "gaming-club",
        role: "Head of Technicals",
        org: "Gaming Club, IIT Indore",
        start: "Dec 2024",
        end: "Apr 2025",
        summary:
            "Led the web team and built a React version of the club website.",
        stack: ["React", "NodeJS", "EJS", "Express"],
        links: [
            {
                label: "Club website",
                url: "https://gamingclubiiti.vercel.app/",
            },
        ],
    },
];

// ── Projects ────────────────────────────────────────────────────────────────
// featured: true  → full card on the Projects page, and a planet in the 3D view
// featured: false → one line under "Earlier work"
// summary is one sentence. points: at most 3.

export const projects = [
    {
        id: "solar-wind-viz",
        name: "Solar Wind & CME Visualization",
        year: "2026",
        context: "B.Tech project",
        summary:
            "Turns MHD simulations of the solar wind and coronal mass ejections into 360° renders you can watch on the web or in VR.",
        points: [
            "Python pipeline (OpenVDB, Blender) that renders 201 MHD snapshots into 804 4K 360° frames.",
            "three.js dashboard to play, scrub and compare the renders from four viewpoints. Uploading a .vtk file queues a render (Python service, SQLite job queue) and the frames come back to the dashboard.",
            "Unity VR app for Meta Quest 3 with thumbstick viewpoint switching, playback controls and haptics.",
        ],
        stack: ["Python", "Blender", "OpenVDB", "Three.js", "SQLite", "Unity"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/BTP-Dashboard",
        },
        screenshots: [
            "/images/BTP/BTP1.png",
            "/images/BTP/BTP2.png",
            "/images/BTP/BTP3.png",
            "/images/BTP/BTP4.png",
            "/images/BTP/BTP5.png",
            "/images/BTP/BTP6.png",
            "/images/BTP/BTP7.png",
            "/images/BTP/BTP8.png",
        ],
        featured: true,
    },
    {
        id: "nityakram",
        name: "Nityakram",
        year: "2026",
        context: "Routine and habit tracker",
        summary:
            "A MERN app to track routines, habits and expenses, with XP, streaks and a daily penalty for missed tasks.",
        points: [
            "JWT access and refresh tokens, Joi validation, rate-limited auth routes and password reset by email.",
            "A nightly cron job applies streak penalties.",
            "Hosted on Vercel, database on MongoDB Atlas.",
        ],
        stack: ["React", "Node.js", "Express", "MongoDB", "JWT", "Joi"],
        links: {
            live: "https://nityakram.vercel.app/",
            code: "https://github.com/Vandan1423/Routine-Habit_Tracker",
        },
        screenshots: [
            "/images/Nityakram/NityaKram1.png",
            "/images/Nityakram/NityaKram2.png",
            "/images/Nityakram/NityaKram3.png",
            "/images/Nityakram/NityaKram4.png",
            "/images/Nityakram/NityaKram5.PNG",
            "/images/Nityakram/NityaKram6.png",
        ],
        featured: true,
    },
    {
        id: "jpl-auction",
        name: "JPL Auction",
        year: "2026",
        context: "Paid client project",
        summary:
            "A real-time cricket player auction with an organizer console and a live screen for viewers.",
        points: [
            "Enforces bid increments and a purse-reservation cap, so every team can still afford a full squad.",
            "Ran a live auction for 8 teams and a pool of 100 players.",
            "Undo, state restore after a reconnect, and Excel and PDF reports.",
        ],
        stack: ["Node.js", "Express", "MongoDB", "Socket.IO"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/JPL_Auction",
        },
        screenshots: [],
        featured: true,
    },
    {
        id: "portfolio-3d",
        name: "3D Space Portfolio",
        year: "2025",
        context: "This website",
        summary:
            "A space-themed portfolio you can fly through, with a plain website view as well.",
        points: [
            "Built with React Three Fiber and Three.js, deployed on Vercel.",
            "You can fly the ship yourself, or jump between star systems from a map.",
            "Draco-compressed models, lazy-loaded assets and code splitting to cut load time.",
        ],
        stack: ["React", "Three.js", "React Three Fiber", "Vite"],
        links: {
            live: "https://vandan-nagori.vercel.app/",
            code: "https://github.com/Vandan1423/portfolio",
        },
        screenshots: [
            "/images/Portfolio/PortfolioSS1.jpeg",
            "/images/Portfolio/PortfolioSS2.jpeg",
            "/images/Portfolio/PortfolioSS3.jpeg",
            "/images/Portfolio/PortfolioSS4.jpeg",
        ],
        featured: true,
    },
    {
        id: "airbnb-replica",
        name: "Airbnb Replica",
        year: "2024",
        context: null,
        summary:
            "A rental listings site where users sign up, post listings with photos, and leave reviews.",
        points: [
            "Session login with Passport.js. Only a listing’s owner can edit or delete it.",
            "Photo uploads stored on Cloudinary, and a map for each listing.",
            "Express and EJS in an MVC layout.",
        ],
        stack: [
            "Node.js",
            "Express",
            "MongoDB",
            "EJS",
            "Passport.js",
            "Cloudinary",
            "Bootstrap",
        ],
        links: {
            live: "https://airbnb-replica-six.vercel.app/",
            code: "https://github.com/Vandan1423/AirBnb_Replica",
        },
        screenshots: [
            "/images/AirBnb_Replica/AirBnbSS1.jpeg",
            "/images/AirBnb_Replica/AirBnbSS2.jpeg",
            "/images/AirBnb_Replica/AirBnbSS3.jpeg",
            "/images/AirBnb_Replica/AirBnbSS4.jpeg",
        ],
        featured: true,
    },
    {
        id: "gaming-club-site",
        name: "Gaming Club Website",
        year: "2024",
        context: "IIT Indore Gaming Club",
        summary:
            "The club’s website, with tournament sign-ups, an event gallery and a team page.",
        points: [
            "Built the tournaments page and made every page responsive.",
            "Later rebuilt the site in React.",
        ],
        stack: ["HTML", "CSS", "JavaScript", "React"],
        links: {
            live: "https://gamingclubiiti.vercel.app/",
            code: "https://github.com/DigitalDiplomacy/gamingclubiiti",
        },
        screenshots: [
            "/images/GamingClubWebsite/GamingClubSS1.jpeg",
            "/images/GamingClubWebsite/GamingClubSS2.jpeg",
            "/images/GamingClubWebsite/GamingClubSS3.jpeg",
            "/images/GamingClubWebsite/GamingClubSS4.jpeg",
        ],
        featured: true,
    },
    {
        id: "astronomy-club-site",
        name: "Astronomy Club Website",
        year: "2024",
        context: "IIT Indore Astronomy Club",
        summary:
            "The club’s website, with research projects, astronomy news, events and the team.",
        points: [
            "Took over the existing codebase, redesigned the UI and fixed navigation bugs.",
            "Maintained the Vercel deployment until 2025.",
        ],
        stack: ["React", "Tailwind CSS"],
        links: {
            live: "https://astronomy-club-iit-indore.vercel.app/",
            code: "https://github.com/AstronomyClubIITIndore/AstronomyClub_IITIndore",
        },
        screenshots: [
            "/images/AstroclubWebsite/AstroClubSS1.jpeg",
            "/images/AstroclubWebsite/AstroClubSS2.jpeg",
            "/images/AstroclubWebsite/AstroClubSS3.jpeg",
            "/images/AstroclubWebsite/AstroClubSS4.jpeg",
        ],
        featured: true,
    },
    {
        id: "educonnect",
        name: "EduConnect",
        year: "2025",
        context: "Academic portal",
        summary:
            "A school portal with separate logins for students and faculty, timetables and study material.",
        points: [
            "Separate student and faculty sessions, with bcrypt password hashing.",
            "Faculty upload documents, slides, videos and quizzes, filtered by grade (9 to 12).",
            "Timetable that shows the next class.",
        ],
        stack: ["Node.js", "Express", "MongoDB", "EJS", "Joi"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/Academic-Portal",
        },
        screenshots: [
            "/images/AcademicPortal/StudentSS1.jpeg",
            "/images/AcademicPortal/StudentSS2.jpeg",
            "/images/AcademicPortal/StudentSS3.jpeg",
            "/images/AcademicPortal/FacultySS1.jpeg",
            "/images/AcademicPortal/FacultySS2.jpeg",
            "/images/AcademicPortal/FacultySS3.jpeg",
            "/images/AcademicPortal/FacultySS4.jpeg",
            "/images/AcademicPortal/FacultySS5.jpeg",
        ],
        featured: true,
    },
    {
        id: "simon-says",
        name: "Simon Says",
        year: null,
        context: null,
        summary: "Memory game in plain JavaScript.",
        points: [],
        stack: ["HTML", "CSS", "JavaScript"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/SimonSaysGame",
        },
        screenshots: ["/images/SimonSaysGame/SimonSaySS.jpeg"],
        featured: true,
    },
    {
        id: "spotify-clone",
        name: "Spotify clone",
        year: null,
        context: null,
        summary: "Spotify’s web player layout in HTML and CSS.",
        points: [],
        stack: ["HTML", "CSS"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/Spotify-Clone",
        },
        screenshots: [
            "/images/Spotify_clone/SpotifySS1.jpeg",
            "/images/Spotify_clone/SpotifySS2.jpeg",
        ],
        featured: true,
    },
    {
        id: "amazon-clone",
        name: "Amazon clone",
        year: null,
        context: null,
        summary: "Amazon’s home page layout in HTML and CSS.",
        points: [],
        stack: ["HTML", "CSS"],
        links: {
            live: null,
            code: "https://github.com/Vandan1423/Amazon-Clone",
        },
        screenshots: [
            "/images/Amazon_clone/AmazonSS1.jpeg",
            "/images/Amazon_clone/AmazonSS2.jpeg",
            "/images/Amazon_clone/AmazonSS3.jpeg",
        ],
        featured: true,
    },
];

// ── Skills ──────────────────────────────────────────────────────────────────
// basic: things you have used but are not confident in (the * on your CV).

export const skills = [
    {
        group: "Programming",
        items: ["Python", "Java", "JavaScript", "Data structures & algorithms"],
        basic: [],
    },
    {
        group: "Frontend",
        items: [
            "React",
            "Flutter",
            "Riverpod",
            "HTML",
            "CSS",
            "Tailwind CSS",
            "Bootstrap",
            "EJS",
        ],
        basic: ["Three.js"],
    },
    {
        group: "Backend & databases",
        items: [
            "Node.js",
            "Express",
            "REST APIs",
            "Socket.IO",
            "JWT",
            "MongoDB",
            "SQL",
        ],
        basic: [],
    },
    {
        group: "Tools",
        items: [
            "Git & GitHub",
            "Docker",
            "Docker Compose",
            "Vite",
            "Postman",
            "Figma",
        ],
        basic: ["Nginx"],
    },
];

// ── Achievements and certifications ─────────────────────────────────────────

export const achievements = [
    {
        title: "Department rank 3",
        detail: "B.Tech Space Science and Engineering, IIT Indore",
        link: null,
    },
    {
        title: "ISRO-NRSC EO Data Processing Challenge",
        detail: "Team entry on cloud and shadow masking, 2025",
        link: "https://drive.google.com/file/d/1-q6SBiWU2cKoJBop2jB0Ocu7QFEokPcj/view?usp=sharing",
    },
];

export const certifications = [
    {
        name: "DSA with Java (Alpha)",
        issuer: "Apna College",
        year: null,
        link: "https://drive.google.com/file/d/1eFrY968Sm9X0YHuu491s-k8zbwVTbAjO/view?usp=sharing",
    },
    {
        name: "Full Stack Web Development (Delta)",
        issuer: "Apna College",
        year: "2024",
        link: "https://drive.google.com/file/d/1si0nCLgmwBxs7s-3OULMWgXy7Hm9RvMr/view?usp=sharing",
    },
];

// ── Journey ─────────────────────────────────────────────────────────────────
// The timeline on the Journey page, oldest first. Keep each line short.

export const journey = [
    {
        year: "2023",
        title: "Joined IIT Indore",
        detail: "B.Tech in Space Science and Engineering, through JEE Advanced (AIR 7823).",
    },
    {
        year: "2023",
        title: "Head of Web Development, Astronomy Club",
        detail: "First time leading a web team.",
    },
    {
        year: "2024",
        title: "Learned full-stack web development",
        detail: "Apna College’s Delta course, then an Airbnb-style listings site as my first full-stack project.",
    },
    {
        year: "2024",
        title: "Head of Technicals, Gaming Club",
        detail: "Rebuilt the club website in React.",
    },
    {
        year: "2025",
        title: "PRIUS research fellowship",
        detail: "Galaxy redshifts and classification from COSMOS survey data.",
    },
    {
        year: "2025",
        title: "ISRO-NRSC EO Data Processing Challenge",
        detail: "Cloud and shadow masking on satellite images, as a team.",
    },
    {
        year: "2026",
        title: "First paid client project",
        detail: "JPL Auction, a live cricket player auction.",
    },
    {
        year: "2026",
        title: "Internship at Arihant Capital",
        detail: "Flutter and React, from June to August.",
    },
    {
        year: "2026",
        title: "B.Tech project",
        detail: "Solar wind and CME visualization, on the web and in VR.",
    },
];
