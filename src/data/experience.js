export const experiences = [
    {
        id: 1,
        type: "research",
        title: "Research Intern",
        organization: "PRIUS Fellowship - IIT Indore",
        duration: "2024",
        description:
            "Worked under the PRIUS Fellowship program to classify galaxies as passive or star-forming using extensive COSMOS survey data, applying computational techniques to astronomical research.",
        responsibilities: [
            "Utilized EAZY-py Python library for photometric redshift estimation through template fitting methods",
            "Generated UVJ (U-V vs V-J color) diagrams for systematic galaxy classification",
            "Performed comprehensive data preprocessing including cleaning, normalization, and parameter optimization",
            "Conducted output analysis to validate classification accuracy and interpret redshift distributions",
            "Applied statistical methods to distinguish between passive and star-forming galaxy populations",
        ],
        technologies: [
            "Python",
            "EAZY-py",
            "Data Analysis",
            "Statistical Modeling",
        ],
        icon: "FaFlask",
        certificate: null,
        output: null,
    },
    {
        id: 2,
        type: "competition",
        title: "Participant",
        organization: "ISRO-NRSC National Challenge",
        duration: "2024",
        description:
            "Participated in ISRO's National Remote Sensing Centre challenge focused on developing machine learning solutions for automated cloud and shadow detection using satellite TOA (Top of Atmosphere) reflectance data.",
        responsibilities: [
            "Performed advanced preprocessing on satellite imagery including reflectance conversion and masking techniques",
            "Implemented UNet-based deep learning architecture for semantic segmentation of clouds and shadows",
            "Developed and optimized end-to-end training pipelines with data augmentation strategies",
            "Fine-tuned model hyperparameters to improve detection accuracy and reduce false positives",
            "Evaluated model performance using metrics like IoU (Intersection over Union) and precision-recall curves",
        ],
        technologies: [
            "Python",
            "Machine Learning",
            "UNet",
            "Computer Vision",
            "Deep Learning",
        ],
        icon: "FaSatellite",
        certificate: "https://drive.google.com/file/d/1FDfQxW21HqVFsd7Uvm_cg9CtT9PQvQGA/view?usp=sharing",
        output: "https://drive.google.com/file/d/19Hc5SQSw6yZfsA2DxpCDA0Bzm6g5m3Go/view?usp=sharing",
    },
    {
        id: 3,
        type: "leadership",
        title: "Head of Web Development",
        organization: "Astronomy Club, IIT Indore",
        duration: "July 2023 - July 2025",
        description:
            "Leading the web development initiatives for the Astronomy Club, managing the official website and overseeing all digital presence to serve the astronomy enthusiast community at IIT Indore.",
        responsibilities: [
            "Lead development and maintenance of the official Astronomy Club website using React.js and Tailwind CSS",
            "Oversee content updates for events, workshops, stargazing sessions, and club activities",
            "Manage website deployment on Vercel ensuring consistent uptime and optimal performance",
            "Collaborate with club members and event coordinators to implement new features and sections",
            "Conduct UI/UX improvements based on user feedback and accessibility standards",
            "Train and mentor junior team members in web development practices"
        ],
        technologies: [
            "React.js",
            "Tailwind CSS",
            "JavaScript",
            "Vercel",
            "Git/GitHub",
        ],
        icon: "FaRocket",
        certificate: null,
        output: "https://astronomy-club-iit-indore.vercel.app/",
    },
    {
        id: 4,
        type: "leadership",
        title: "Head of Technicals",
        organization: "Gaming Club, IIT Indore",
        duration: "December 2024 - April 2025",
        description:
            "Leading technical operations for the Gaming Club, overseeing website development, managing technical infrastructure for gaming events, and coordinating tournament logistics.",
        responsibilities: [
            "Oversee technical aspects of club operations including website maintenance and feature development",
            "Lead development team in building tournament registration and management systems",
            "Coordinate technical requirements for gaming tournaments and esports events",
            "Manage technical infrastructure ensuring smooth operation during live events",
            "Implement and maintain tournament registration portal with real-time updates",
            "Troubleshoot technical issues ensuring seamless experience",
        ],
        technologies: [
            "HTML",
            "CSS",
            "JavaScript",
            "Node.js",
            "Express.js",
            "React.js",
        ],
        icon: "FaGamepad",
        certificate: null,
        output: "https://gamingclubiiti.vercel.app/",
    },
];

// Helper functions
export const getExperiencesByType = (type) => {
    if (type === "All") return experiences;
    return experiences.filter((exp) => exp.type === type);
};
