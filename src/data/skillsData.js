/**
 * Skill tree data, built from the skills list in profile.js.
 *
 * Add, remove or regroup skills in profile.js. This file only holds which
 * skills the tree highlights together when one of them is selected.
 */

import { skills } from './profile';

// Related skills, by the exact names used in profile.js. Names that are not
// in profile.js are ignored, so removing a skill there never breaks the tree.
const RELATED = {
    Python: ['Java', 'JavaScript'],
    JavaScript: ['React', 'Node.js', 'HTML'],
    React: ['JavaScript', 'Tailwind CSS', 'Vite', 'Three.js'],
    Flutter: ['Riverpod'],
    Riverpod: ['Flutter'],
    HTML: ['CSS', 'EJS'],
    CSS: ['HTML', 'Tailwind CSS', 'Bootstrap'],
    'Tailwind CSS': ['CSS', 'React'],
    Bootstrap: ['CSS', 'HTML'],
    EJS: ['HTML', 'Express'],
    'Three.js': ['JavaScript', 'React'],
    'Node.js': ['JavaScript', 'Express', 'Socket.IO'],
    Express: ['Node.js', 'MongoDB', 'REST APIs', 'JWT'],
    'REST APIs': ['Express', 'Postman'],
    'Socket.IO': ['Node.js'],
    JWT: ['Express'],
    MongoDB: ['Express', 'Node.js'],
    SQL: ['Python'],
    Docker: ['Docker Compose', 'Nginx'],
    'Docker Compose': ['Docker'],
    Nginx: ['Docker'],
    Vite: ['React'],
    Postman: ['REST APIs'],
};

const toId = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const toNode = (name, group, basic) => ({
    id: toId(name),
    name,
    group: group.group,
    basic,
    relatedTo: (RELATED[name] || []).map(toId),
});

const skillsData = {
    root: { id: 'root', name: 'Skills' },
    categories: skills.map((group) => ({
        id: `group-${toId(group.group)}`,
        name: group.group,
        technologies: [
            ...group.items.map((name) => toNode(name, group, false)),
            ...group.basic.map((name) => toNode(name, group, true)),
        ],
    })),
};

export default skillsData;
