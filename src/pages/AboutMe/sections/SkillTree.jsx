import React, { useState } from 'react';
import styles from './SkillTree.module.css';

/**
 * SkillTree
 * Skills as a tree: root → groups → skills, one column per group.
 * Click a group to highlight its skills, or a skill to highlight the skills
 * related to it. Click again, or on empty space, to clear.
 * Props:
 * - skillsData: { root, categories: [{ id, name, technologies: [{ id, name, basic, relatedTo }] }] }
 */

// Layout, in SVG units. The SVG scales to the width of its container.
const MIN_VIEW_WIDTH = 1000;
const ROOT_Y = 40;
const GROUP_Y = 112;
const FIRST_SKILL_Y = 158;
const SKILL_STEP = 34;
const BOTTOM_PAD = 20;
const LEFT_PAD = 30;
const BRANCH = 22; // from a group's trunk to a skill's dot
const LABEL_GAP = 16; // from a skill's dot to its label
const COLUMN_GAP = 28;

// Rough text widths, so a long skill name never runs into the next column
const SKILL_CHAR = 7.4;
const GROUP_CHAR = 8.6;

const columnNeeds = (category) => {
    const longestSkill = Math.max(0, ...category.technologies.map((t) => t.name.length));
    const skillWidth = BRANCH + LABEL_GAP + longestSkill * SKILL_CHAR;
    const groupWidth = 14 + category.name.length * GROUP_CHAR;
    return Math.max(skillWidth, groupWidth) + COLUMN_GAP;
};

const SkillTree = ({ skillsData }) => {
    const [selected, setSelected] = useState(null);
    const { root, categories } = skillsData;

    // Column widths: what each group needs, plus an equal share of what's left
    const needs = categories.map(columnNeeds);
    const totalNeed = LEFT_PAD + needs.reduce((sum, n) => sum + n, 0);
    const viewWidth = Math.max(MIN_VIEW_WIDTH, totalNeed);
    const extra = (viewWidth - totalNeed) / categories.length;

    const columns = categories.map((category, index) => {
        const x = needs.slice(0, index).reduce((sum, n) => sum + n + extra, LEFT_PAD);
        return {
            category,
            x,
            width: needs[index] + extra - COLUMN_GAP,
            skills: category.technologies.map((tech, row) => ({
                tech,
                y: FIRST_SKILL_Y + row * SKILL_STEP,
            })),
        };
    });

    const rootX = viewWidth / 2;
    const longest = Math.max(1, ...categories.map((c) => c.technologies.length));
    const viewHeight = FIRST_SKILL_Y + (longest - 1) * SKILL_STEP + BOTTOM_PAD;

    // A group lights up itself and its skills; a skill lights up itself and its related skills
    const lit = new Set(
        !selected
            ? []
            : selected.technologies
              ? [selected.id, ...selected.technologies.map((t) => t.id)]
              : [selected.id, ...selected.relatedTo]
    );
    const groupLit = (column) =>
        lit.has(column.category.id) || column.skills.some(({ tech }) => lit.has(tech.id));
    const dimClass = (isLit) => (selected && !isLit ? styles.dimmed : '');

    const toggle = (node) => setSelected((current) => (current?.id === node.id ? null : node));

    const nodeProps = (node, label) => ({
        role: 'button',
        tabIndex: 0,
        'aria-pressed': selected?.id === node.id,
        'aria-label': label,
        onClick: (e) => {
            e.stopPropagation();
            toggle(node);
        },
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle(node);
            }
        },
    });

    // The line under the tree says what the highlight means
    const names = Object.fromEntries(
        categories.flatMap((c) => c.technologies.map((t) => [t.id, t.name]))
    );
    let caption = 'Click a group or a skill to highlight what goes with it. Hollow dots are skills I know at a basic level.';
    if (selected?.technologies) {
        caption = `${selected.name}: ${selected.technologies.length} skills.`;
    } else if (selected) {
        const related = selected.relatedTo.map((id) => names[id]).filter(Boolean);
        caption = related.length
            ? `${selected.name}: related to ${related.join(', ')}.`
            : `${selected.name}.`;
    }

    // Lit lines are drawn last so they sit on top of the shared trunks
    const rootLines = columns.map((column) => {
        const midY = (ROOT_Y + GROUP_Y) / 2;
        return {
            key: `root-${column.category.id}`,
            d: `M ${rootX},${ROOT_Y} C ${rootX},${midY} ${column.x},${midY} ${column.x},${GROUP_Y}`,
            isLit: groupLit(column),
        };
    });
    const skillLines = columns.flatMap((column) =>
        column.skills.map(({ tech, y }) => ({
            key: `line-${tech.id}`,
            d: `M ${column.x},${GROUP_Y} V ${y - 8} Q ${column.x},${y} ${column.x + 8},${y} H ${column.x + BRANCH}`,
            isLit: lit.has(tech.id),
        }))
    );
    const lines = [...rootLines, ...skillLines].sort((a, b) => a.isLit - b.isLit);

    return (
        <div>
            <svg
                viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                className={styles.tree}
                role="group"
                aria-label="Skill tree"
                onClick={() => setSelected(null)}
            >
                {lines.map((line) => (
                    <path
                        key={line.key}
                        d={line.d}
                        className={`${styles.line} ${line.isLit ? styles.lineLit : dimClass(false)}`}
                    />
                ))}

                {/* Root */}
                <g>
                    <circle cx={rootX} cy={ROOT_Y} r="5" className={styles.dot} />
                    <text x={rootX} y={ROOT_Y - 14} className={styles.rootLabel}>
                        {root.name}
                    </text>
                </g>

                {columns.map((column) => {
                    const { category, x, width } = column;
                    return (
                        <g key={category.id}>
                            {/* Group */}
                            <g
                                className={`${styles.node} ${lit.has(category.id) ? styles.lit : ''} ${dimClass(groupLit(column))}`}
                                {...nodeProps(category, `${category.name}, ${category.technologies.length} skills`)}
                            >
                                <rect
                                    x={x - 10}
                                    y={GROUP_Y - 16}
                                    width={width + 10}
                                    height="32"
                                    rx="6"
                                    className={styles.hit}
                                />
                                <circle cx={x} cy={GROUP_Y} r="6" className={styles.dot} />
                                <text x={x + 14} y={GROUP_Y + 5} className={styles.groupLabel}>
                                    {category.name}
                                </text>
                            </g>

                            {/* Skills */}
                            {column.skills.map(({ tech, y }) => (
                                <g
                                    key={tech.id}
                                    className={`${styles.node} ${lit.has(tech.id) ? styles.lit : ''} ${dimClass(lit.has(tech.id))}`}
                                    {...nodeProps(tech, tech.basic ? `${tech.name}, basic` : tech.name)}
                                >
                                    <rect
                                        x={x + BRANCH - 6}
                                        y={y - 14}
                                        width={width - BRANCH + 6}
                                        height="28"
                                        rx="6"
                                        className={styles.hit}
                                    />
                                    <circle
                                        cx={x + BRANCH + 4.5}
                                        cy={y}
                                        r="4.5"
                                        className={tech.basic ? styles.dotBasic : styles.dot}
                                    />
                                    <text x={x + BRANCH + LABEL_GAP} y={y + 5} className={styles.label}>
                                        {tech.name}
                                    </text>
                                </g>
                            ))}
                        </g>
                    );
                })}
            </svg>

            <p className={styles.caption} aria-live="polite">
                {caption}
            </p>
        </div>
    );
};

export default SkillTree;
