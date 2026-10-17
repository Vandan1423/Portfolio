/**
 * Text for the 3D planet info panels, built from profile.js.
 *
 * Nothing personal is typed here. To change what a panel says, edit profile.js.
 * Each panel can have: title, subtitle, description, details [{label, value}],
 * highlights [string], links [{label, url}]. PlanetInfoPanel skips missing parts.
 */

import {
    achievements,
    certifications,
    education,
    experience,
    journey,
    links,
    person,
    positions,
    projects,
    skills,
} from './profile';

// Returns undefined for a missing or empty list so the panel hides that block.
// profile.js fields can be null or left out, so nothing here assumes a list exists.
const nonEmpty = (list) => {
    const kept = (list || []).filter(Boolean);
    return kept.length ? kept : undefined;
};

const skillLine = (group) =>
    [...(group.items || []), ...(group.basic || []).map((name) => `${name} (basic)`)].join(', ');

const projectPanel = (project) => ({
    title: project.name,
    subtitle: project.context || project.year,
    description: project.summary,
    details: nonEmpty([
        project.year && { label: 'Year', value: project.year },
        project.stack?.length && { label: 'Stack', value: project.stack.join(', ') },
    ]),
    highlights: nonEmpty(project.points),
    links: nonEmpty([
        project.links?.live && { label: 'Live site', url: project.links.live },
        project.links?.code && { label: 'Code', url: project.links.code },
    ]),
});

const rolePanel = (role) => ({
    title: role.role,
    subtitle: role.org,
    description: role.summary,
    details: nonEmpty([
        { label: 'Dates', value: `${role.start} – ${role.end}` },
        role.location && { label: 'Location', value: role.location },
        role.stack?.length && { label: 'Stack', value: role.stack.join(', ') },
    ]),
    highlights: nonEmpty(
        role.projects
            ? role.projects.map((p) => `${p.name}: ${p.text}`)
            : role.points || []
    ),
    links: nonEmpty([
        ...(role.projects || [])
            .filter((p) => p.link)
            .map((p) => ({ label: p.name, url: p.link })),
        ...(role.links || []),
    ]),
});

const byId = (items, toPanel) =>
    Object.fromEntries(items.map((item) => [item.id, toPanel(item)]));

const achievementsPanel = {
    title: 'Achievements',
    highlights: nonEmpty((achievements || []).map((a) => `${a.title}: ${a.detail}`)),
    links: nonEmpty(
        (achievements || []).filter((a) => a.link).map((a) => ({ label: a.title, url: a.link }))
    ),
};

const panels = {
    'alpha-centauri': {
        'personal-info': {
            title: person.name,
            subtitle: person.headline,
            description: person.bio,
            details: nonEmpty([
                { label: 'Role', value: person.role },
                { label: 'Location', value: person.location },
                { label: 'Email', value: person.email },
                person.phone && { label: 'Phone', value: person.phone },
            ]),
            links: nonEmpty([
                { label: 'GitHub', url: links.github },
                { label: 'LinkedIn', url: links.linkedin },
            ]),
        },
        education: {
            title: 'Education',
            subtitle: education.school,
            description: education.degree,
            details: nonEmpty([
                { label: 'Years', value: education.years },
                { label: 'CGPA', value: education.cgpa },
                ...(education.schooling || []).map((s) => ({
                    label: s.name,
                    value: `${s.score} (${s.year})`,
                })),
            ]),
        },
        'tech-stack': {
            title: 'Skills',
            details: nonEmpty(skills.map((g) => ({ label: g.group, value: skillLine(g) }))),
        },
        achievements: achievementsPanel,
        certifications: {
            title: 'Certifications',
            highlights: nonEmpty(
                certifications.map((c) =>
                    [c.name, c.issuer, c.year].filter(Boolean).join(', ')
                )
            ),
            links: nonEmpty(
                certifications.filter((c) => c.link).map((c) => ({ label: c.name, url: c.link }))
            ),
        },
    },

    sirius: byId(
        projects.filter((p) => p.featured),
        projectPanel
    ),

    vega: byId([...experience, ...positions], rolePanel),

    polaris: {
        'journey-milestones': {
            title: 'Journey',
            highlights: nonEmpty(journey.map((j) => `${j.year}: ${j.title}`)),
        },
        'journey-achievements': achievementsPanel,
    },
};

/**
 * Get the panel for one planet.
 * @param {string} systemId - Star system ID, e.g. "alpha-centauri"
 * @param {string} sectionId - The planet's sectionId, e.g. "education"
 * @returns {object|null}
 */
export const getSectionData = (systemId, sectionId) => {
    if (!systemId || !sectionId) return null;
    return panels[systemId]?.[sectionId] || null;
};
