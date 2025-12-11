export const technologiesData = {
    root: {
        id: 'root',
        name: 'Tech Foundation',
        icon: '🌳',
        description: 'Core programming and development foundation'
    },

    categories: [
        {
            id: 'frontend',
            name: 'Frontend',
            icon: '🎨',
            color: '#4F46E5',  // Primary indigo
            description: 'User interface and client-side development',
            proficiency: 90,
            technologies: [
                {
                    id: 'react',
                    name: 'React',
                    icon: '⚛️',
                    proficiency: 95,
                    yearsOfExperience: 2,
                    projects: ['AirBnb Replica', 'Portfolio', 'Gaming Club Website'],
                    relatedTo: ['javascript', 'nodejs', 'tailwind', 'bootstrap'],
                    description: 'Component-based UI library for building dynamic user interfaces',
                    keyFeatures: ['Hooks', 'Context API', 'Virtual DOM', 'JSX']
                },
                {
                    id: 'javascript',
                    name: 'JavaScript',
                    icon: '🟨',
                    proficiency: 92,
                    yearsOfExperience: 3,
                    projects: ['All web projects'],
                    relatedTo: ['react', 'nodejs', 'express'],
                    description: 'Core programming language for web development',
                    keyFeatures: ['ES6+', 'Async/Await', 'Promises', 'DOM Manipulation']
                },
                {
                    id: 'html',
                    name: 'HTML5',
                    icon: '🔴',
                    proficiency: 95,
                    yearsOfExperience: 3,
                    projects: ['All web projects'],
                    relatedTo: ['css', 'javascript'],
                    description: 'Semantic markup language for structuring web content',
                    keyFeatures: ['Semantic Tags', 'Forms', 'Accessibility', 'SEO']
                },
                {
                    id: 'css',
                    name: 'CSS3',
                    icon: '🔵',
                    proficiency: 93,
                    yearsOfExperience: 3,
                    projects: ['All web projects'],
                    relatedTo: ['html', 'tailwind', 'bootstrap'],
                    description: 'Styling language for creating beautiful, responsive designs',
                    keyFeatures: ['Flexbox', 'Grid', 'Animations', 'Responsive Design']
                },
                {
                    id: 'tailwind',
                    name: 'Tailwind CSS',
                    icon: '💨',
                    proficiency: 88,
                    yearsOfExperience: 1.5,
                    projects: ['AirBnb Replica', 'Gaming Club Website'],
                    relatedTo: ['react', 'css', 'html'],
                    description: 'Utility-first CSS framework for rapid UI development',
                    keyFeatures: ['Utility Classes', 'Responsive', 'Customizable', 'Dark Mode']
                },
                {
                    id: 'bootstrap',
                    name: 'Bootstrap',
                    icon: '🅱️',
                    proficiency: 85,
                    yearsOfExperience: 2,
                    projects: ['Portfolio'],
                    relatedTo: ['html', 'css', 'javascript'],
                    description: 'Popular CSS framework with pre-built components',
                    keyFeatures: ['Grid System', 'Components', 'Responsive', 'Icons']
                },
                {
                    id: 'threejs',
                    name: 'Three.js',
                    icon: '🎲',
                    proficiency: 82,
                    yearsOfExperience: 0.5,
                    projects: ['Portfolio'],
                    relatedTo: ['javascript', 'react'],
                    description: '3D graphics library for creating immersive experiences',
                    keyFeatures: ['WebGL', '3D Models', 'Animations', 'Shaders']
                }
            ]
        },
        {
            id: 'backend',
            name: 'Backend',
            icon: '⚙️',
            color: '#60A5FA',  // Accent blue
            description: 'Server-side logic and API development',
            proficiency: 85,
            technologies: [
                {
                    id: 'nodejs',
                    name: 'Node.js',
                    icon: '🟢',
                    proficiency: 88,
                    yearsOfExperience: 2,
                    projects: ['AirBnb Replica', 'Gaming Club Website'],
                    relatedTo: ['javascript', 'express', 'mongodb'],
                    description: 'JavaScript runtime for building scalable server-side applications',
                    keyFeatures: ['Event-driven', 'Non-blocking I/O', 'NPM', 'Async']
                },
                {
                    id: 'express',
                    name: 'Express',
                    icon: '🚂',
                    proficiency: 87,
                    yearsOfExperience: 2,
                    projects: ['AirBnb Replica', 'Gaming Club Website'],
                    relatedTo: ['nodejs', 'mongodb', 'javascript'],
                    description: 'Fast, minimalist web framework for Node.js',
                    keyFeatures: ['Routing', 'Middleware', 'RESTful APIs', 'MVC']
                },
                {
                    id: 'python',
                    name: 'Python',
                    icon: '🐍',
                    proficiency: 85,
                    yearsOfExperience: 2.5,
                    projects: ['Academic Projects', 'DSA Practice'],
                    relatedTo: ['cpp'],
                    description: 'Versatile programming language for various applications',
                    keyFeatures: ['Data Structures', 'Algorithms', 'OOP', 'Libraries']
                },
                {
                    id: 'cpp',
                    name: 'C/C++',
                    icon: '⚡',
                    proficiency: 80,
                    yearsOfExperience: 2,
                    projects: ['DSA Practice', 'Academic Projects'],
                    relatedTo: ['python'],
                    description: 'High-performance programming language for system-level code',
                    keyFeatures: ['Memory Management', 'OOP', 'STL', 'Performance']
                },
                {
                    id: 'ejs',
                    name: 'EJS',
                    icon: '📝',
                    proficiency: 83,
                    yearsOfExperience: 1.5,
                    projects: ['Gaming Club Website'],
                    relatedTo: ['nodejs', 'express', 'html'],
                    description: 'Embedded JavaScript templating for dynamic HTML',
                    keyFeatures: ['Server Rendering', 'Dynamic Content', 'Partials', 'Layouts']
                }
            ]
        },
        {
            id: 'database',
            name: 'Databases',
            icon: '🗄️',
            color: '#34D399',  // Success green
            description: 'Data storage and management',
            proficiency: 82,
            technologies: [
                {
                    id: 'mongodb',
                    name: 'MongoDB',
                    icon: '🍃',
                    proficiency: 85,
                    yearsOfExperience: 2,
                    projects: ['AirBnb Replica', 'Gaming Club Website'],
                    relatedTo: ['nodejs', 'express'],
                    description: 'NoSQL document database for flexible data storage',
                    keyFeatures: ['Flexible Schema', 'Scalability', 'Aggregation', 'Atlas']
                },
                {
                    id: 'sql',
                    name: 'SQL',
                    icon: '📊',
                    proficiency: 80,
                    yearsOfExperience: 1.5,
                    projects: ['Academic Projects'],
                    relatedTo: [],
                    description: 'Structured Query Language for relational databases',
                    keyFeatures: ['Queries', 'Joins', 'Transactions', 'Normalization']
                }
            ]
        },
        {
            id: 'tools',
            name: 'Tools & DevOps',
            icon: '🔧',
            color: '#F59E0B',  // Secondary amber
            description: 'Development tools and version control',
            proficiency: 88,
            technologies: [
                {
                    id: 'git',
                    name: 'Git/GitHub',
                    icon: '🐙',
                    proficiency: 90,
                    yearsOfExperience: 3,
                    projects: ['All projects'],
                    relatedTo: [],
                    description: 'Version control system for tracking code changes',
                    keyFeatures: ['Branching', 'Collaboration', 'Pull Requests', 'CI/CD']
                },
                {
                    id: 'vscode',
                    name: 'VS Code',
                    icon: '💻',
                    proficiency: 95,
                    yearsOfExperience: 3,
                    projects: ['All projects'],
                    relatedTo: ['git'],
                    description: 'Powerful code editor with extensive extension support',
                    keyFeatures: ['Extensions', 'Debugging', 'Git Integration', 'IntelliSense']
                },
                {
                    id: 'npm',
                    name: 'NPM',
                    icon: '📦',
                    proficiency: 87,
                    yearsOfExperience: 2,
                    projects: ['All web projects'],
                    relatedTo: ['nodejs', 'javascript'],
                    description: 'Package manager for JavaScript dependencies',
                    keyFeatures: ['Package Management', 'Scripts', 'Dependencies', 'Registry']
                },
                {
                    id: 'postman',
                    name: 'Postman',
                    icon: '📮',
                    proficiency: 83,
                    yearsOfExperience: 1.5,
                    projects: ['AirBnb Replica', 'Gaming Club Website'],
                    relatedTo: ['nodejs', 'express', 'mongodb'],
                    description: 'API development and testing platform',
                    keyFeatures: ['API Testing', 'Collections', 'Environment', 'Automation']
                }
            ]
        }
    ]
};
