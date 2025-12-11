import React, { useState, useEffect } from 'react';
import styles from './Technologies.module.css';
import { technologiesData } from './technologiesData';

const Technologies = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const [highlightedTechs, setHighlightedTechs] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);

    // Scroll to tech details when selected
    useEffect(() => {
        if (selectedTech) {
            const element = document.getElementById(`tech-${selectedTech.id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedTech]);

    const handleNodeClick = (tech) => {
        if (tech.technologies) {
            // Clicked a category
            handleCategoryFilter(tech.id);
        } else {
            // Clicked a technology
            setSelectedTech(tech);
            const relatedIds = tech.relatedTo || [];
            setHighlightedTechs([tech.id, ...relatedIds]);
        }
    };

    const handleCategoryFilter = (categoryId) => {
        setActiveCategory(categoryId === activeCategory ? null : categoryId);
        setSelectedTech(null);
        setHighlightedTechs([]);
    };

    const clearSelection = () => {
        setSelectedTech(null);
        setHighlightedTechs([]);
    };

    // Calculate positions with better spacing to prevent overlap
    const rootPos = { x: 650, y: 100 };
    const categoryY = 280;
    const baseTechY = 480;
    const minNodeSpacing = 140; // Increased space between nodes horizontally
    const verticalRowSpacing = 120; // Increased space between rows
    const maxNodesPerRow = 2; // Reduced to 2 nodes per row for more space

    // Category positions (spread wider and centered)
    const categoryPositions = technologiesData.categories.map((cat, index) => {
        const positions = [240, 500, 800, 1060]; // Fixed positions for 4 categories, better spaced
        return { x: positions[index], y: categoryY };
    });

    // Tech positions (arranged in rows under each category to prevent overlap)
    const techPositions = {};
    technologiesData.categories.forEach((category, catIndex) => {
        const catPos = categoryPositions[catIndex];
        const techCount = category.technologies.length;

        // Arrange technologies in rows to prevent overlap
        category.technologies.forEach((tech, techIndex) => {
            const row = Math.floor(techIndex / maxNodesPerRow);
            const col = techIndex % maxNodesPerRow;
            const nodesInThisRow = Math.min(maxNodesPerRow, techCount - (row * maxNodesPerRow));

            // Calculate horizontal position (centered for each row)
            const rowWidth = (nodesInThisRow - 1) * minNodeSpacing;
            const rowStartX = catPos.x - (rowWidth / 2);
            const x = rowStartX + (col * minNodeSpacing);

            // Calculate vertical position (multiple rows)
            const y = baseTechY + (row * verticalRowSpacing);

            techPositions[tech.id] = {
                x: x,
                y: y,
                categoryColor: category.color
            };
        });
    });

    // Generate bezier curve path
    const generatePath = (from, to) => {
        const midY = (from.y + to.y) / 2;
        return `M ${from.x},${from.y} C ${from.x},${midY} ${to.x},${midY} ${to.x},${to.y}`;
    };

    // Check if node should be highlighted
    const isNodeHighlighted = (nodeId) => {
        if (!selectedTech) return false;
        return highlightedTechs.includes(nodeId);
    };

    // Check if node should be dimmed
    const isNodeDimmed = (nodeId) => {
        if (!selectedTech) return false;
        return !highlightedTechs.includes(nodeId);
    };

    // Check if category should be dimmed
    const isCategoryDimmed = (categoryId) => {
        return activeCategory && activeCategory !== categoryId;
    };

    return (
        <div className={styles.container}>
            {/* Background */}
            <div className={styles.spaceBackground}></div>

            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroTitle}>
                        <h1 className={styles.mainTitle}>Technology Tree</h1>
                        <div className={styles.titleUnderline}></div>
                    </div>
                    <p className={styles.heroSubtitle}>
                        Explore my technical ecosystem: skills, proficiencies, and connections
                    </p>
                    <div className={styles.heroStars}>
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={styles.heroStar}
                                style={{ '--star-delay': `${i * 0.3}s` }}
                            />
                        ))}
                    </div>
                </div>
                <div className={styles.scrollIndicator}>
                    <div className={styles.scrollArrow}></div>
                    <span className={styles.scrollText}>Scroll to explore</span>
                </div>
            </section>

            {/* Section 1: Interactive Tree Visualization */}
            <section className={styles.treeSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNumber}>01</span>
                    <h2 className={styles.glitchTitle} data-text="SKILL TREE">
                        SKILL TREE
                    </h2>
                </div>

                <div className={styles.treeContainer}>
                    <svg
                        viewBox="0 0 1300 1000"
                        className={styles.treeSvg}
                        preserveAspectRatio="xMidYMid meet"
                        onClick={clearSelection}
                    >
                        <defs>
                            {/* Gradient definitions for each category */}
                            {technologiesData.categories.map(cat => (
                                <linearGradient
                                    key={`gradient-${cat.id}`}
                                    id={`gradient-${cat.id}`}
                                    x1="0%" y1="0%" x2="0%" y2="100%"
                                >
                                    <stop offset="0%" stopColor={cat.color} stopOpacity="0.8" />
                                    <stop offset="100%" stopColor={cat.color} stopOpacity="0.3" />
                                </linearGradient>
                            ))}

                            {/* Glow filter */}
                            <filter id="nodeGlow">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Root to Category connections */}
                        {categoryPositions.map((catPos, index) => (
                            <path
                                key={`root-cat-${index}`}
                                d={generatePath(rootPos, catPos)}
                                stroke={`url(#gradient-${technologiesData.categories[index].id})`}
                                strokeWidth="2"
                                fill="none"
                                className={styles.connectionPath}
                                opacity={
                                    isCategoryDimmed(technologiesData.categories[index].id)
                                        ? 0.2
                                        : 1
                                }
                            />
                        ))}

                        {/* Category to Tech connections */}
                        {technologiesData.categories.map((category, catIndex) =>
                            category.technologies.map(tech => {
                                const catPos = categoryPositions[catIndex];
                                const techPos = techPositions[tech.id];

                                return (
                                    <path
                                        key={`cat-tech-${tech.id}`}
                                        d={generatePath(catPos, techPos)}
                                        stroke={techPos.categoryColor}
                                        strokeWidth="1.5"
                                        fill="none"
                                        className={styles.connectionPath}
                                        opacity={isNodeDimmed(tech.id) ? 0.1 : 0.5}
                                    />
                                );
                            })
                        )}

                        {/* Relationship connections (when tech is selected) */}
                        {selectedTech && selectedTech.relatedTo?.map(relatedId => {
                            const fromPos = techPositions[selectedTech.id];
                            const toPos = techPositions[relatedId];

                            if (!fromPos || !toPos) return null;

                            return (
                                <path
                                    key={`rel-${selectedTech.id}-${relatedId}`}
                                    d={generatePath(fromPos, toPos)}
                                    stroke="#F59E0B"
                                    strokeWidth="2"
                                    fill="none"
                                    className={styles.relationshipPath}
                                    strokeDasharray="5,5"
                                >
                                    {/* Animated particle */}
                                    <animate
                                        attributeName="stroke-dashoffset"
                                        from="0"
                                        to="10"
                                        dur="0.5s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                            );
                        })}

                        {/* Root Node */}
                        <g
                            className={styles.treeNode}
                            transform={`translate(${rootPos.x}, ${rootPos.y})`}
                            onMouseEnter={() => setHoveredNode(technologiesData.root)}
                            onMouseLeave={() => setHoveredNode(null)}
                        >
                            <circle
                                r="35"
                                fill="rgba(79, 70, 229, 0.2)"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                filter="url(#nodeGlow)"
                            />
                            <circle r="42" fill="none" stroke="#4F46E5" strokeWidth="1" opacity="0.3" />
                            <text
                                textAnchor="middle"
                                dy="5"
                                fontSize="24"
                                fill="#fff"
                            >
                                {technologiesData.root.icon}
                            </text>
                        </g>

                        {/* Category Nodes */}
                        {technologiesData.categories.map((category, index) => {
                            const pos = categoryPositions[index];
                            const isDimmed = isCategoryDimmed(category.id);

                            return (
                                <g
                                    key={category.id}
                                    className={styles.categoryNode}
                                    transform={`translate(${pos.x}, ${pos.y})`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleNodeClick(category);
                                    }}
                                    onMouseEnter={() => setHoveredNode(category)}
                                    onMouseLeave={() => setHoveredNode(null)}
                                    opacity={isDimmed ? 0.3 : 1}
                                >
                                    <circle
                                        r="30"
                                        fill={`${category.color}20`}
                                        stroke={category.color}
                                        strokeWidth="2"
                                        filter="url(#nodeGlow)"
                                        className={styles.nodeCircle}
                                    />
                                    {/* Proficiency ring */}
                                    <circle
                                        r="38"
                                        fill="none"
                                        stroke={category.color}
                                        strokeWidth="2"
                                        opacity="0.3"
                                        strokeDasharray={`${2 * Math.PI * 38 * (category.proficiency / 100)}, ${2 * Math.PI * 38}`}
                                        transform="rotate(-90)"
                                        className={styles.proficiencyRing}
                                    />
                                    <text
                                        textAnchor="middle"
                                        dy="5"
                                        fontSize="20"
                                        fill="#fff"
                                    >
                                        {category.icon}
                                    </text>
                                </g>
                            );
                        })}

                        {/* Technology Nodes */}
                        {technologiesData.categories.flatMap(category =>
                            category.technologies.map(tech => {
                                const pos = techPositions[tech.id];
                                const isHighlighted = isNodeHighlighted(tech.id);
                                const isDimmed = isNodeDimmed(tech.id);
                                const isSelected = selectedTech?.id === tech.id;

                                // Calculate size based on proficiency
                                const baseSize = 20;
                                const sizeBoost = (tech.proficiency / 100) * 8;
                                const radius = baseSize + sizeBoost;

                                return (
                                    <g
                                        key={tech.id}
                                        className={styles.techNode}
                                        transform={`translate(${pos.x}, ${pos.y})`}
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleNodeClick(tech);
                                        }}
                                        onMouseEnter={() => setHoveredNode(tech)}
                                        onMouseLeave={() => setHoveredNode(null)}
                                        opacity={isDimmed ? 0.15 : 1}
                                    >
                                        {/* Glow effect based on proficiency */}
                                        <circle
                                            r={radius + 10}
                                            fill={pos.categoryColor}
                                            opacity={tech.proficiency / 300}
                                            filter="url(#nodeGlow)"
                                            className={isHighlighted ? styles.glowPulse : ''}
                                        />

                                        <circle
                                            r={radius}
                                            fill={`${pos.categoryColor}30`}
                                            stroke={pos.categoryColor}
                                            strokeWidth={isSelected ? 3 : 2}
                                            filter="url(#nodeGlow)"
                                            className={styles.nodeCircle}
                                        />

                                        {/* Proficiency indicator ring */}
                                        <circle
                                            r={radius + 6}
                                            fill="none"
                                            stroke={pos.categoryColor}
                                            strokeWidth="2"
                                            opacity="0.4"
                                            strokeDasharray={`${2 * Math.PI * (radius + 6) * (tech.proficiency / 100)}, ${2 * Math.PI * (radius + 6)}`}
                                            transform="rotate(-90)"
                                        />

                                        <text
                                            textAnchor="middle"
                                            dy="4"
                                            fontSize="14"
                                            fill="#fff"
                                        >
                                            {tech.icon}
                                        </text>

                                        {/* Orbiting particles for high proficiency */}
                                        {tech.proficiency >= 85 && (
                                            <>
                                                <circle r="3" fill={pos.categoryColor} opacity="0.8">
                                                    <animateMotion
                                                        path={`M ${radius + 15} 0 A ${radius + 15} ${radius + 15} 0 1 1 ${-(radius + 15)} 0 A ${radius + 15} ${radius + 15} 0 1 1 ${radius + 15} 0`}
                                                        dur="3s"
                                                        repeatCount="indefinite"
                                                    />
                                                </circle>
                                            </>
                                        )}
                                    </g>
                                );
                            })
                        )}

                        {/* Tooltip */}
                        {hoveredNode && hoveredNode.id && (
                            <g
                                className={styles.tooltip}
                                transform={`translate(${
                                    techPositions[hoveredNode.id]?.x + 50 ||
                                    categoryPositions.find((_, i) => technologiesData.categories[i].id === hoveredNode.id)?.x + 50 ||
                                    rootPos.x + 50
                                }, ${
                                    techPositions[hoveredNode.id]?.y ||
                                    categoryPositions.find((_, i) => technologiesData.categories[i].id === hoveredNode.id)?.y ||
                                    rootPos.y
                                })`}
                                pointerEvents="none"
                            >
                                <rect
                                    width="200"
                                    height="80"
                                    fill="rgba(26, 26, 46, 0.95)"
                                    stroke="#4F46E5"
                                    strokeWidth="2"
                                    rx="8"
                                    filter="url(#nodeGlow)"
                                />
                                <text x="10" y="25" fontSize="14" fill="#fff" fontWeight="bold">
                                    {hoveredNode.name}
                                </text>
                                <text x="10" y="45" fontSize="11" fill="#94A3B8">
                                    {hoveredNode.proficiency ? `Proficiency: ${hoveredNode.proficiency}%` : hoveredNode.description}
                                </text>
                                {hoveredNode.yearsOfExperience && (
                                    <text x="10" y="65" fontSize="11" fill="#94A3B8">
                                        Experience: {hoveredNode.yearsOfExperience} years
                                    </text>
                                )}
                            </g>
                        )}
                    </svg>

                    <div className={styles.treeInstructions}>
                        <p>💡 Click nodes to see relationships • Hover for details</p>
                    </div>
                </div>
            </section>

            {/* Section 2: Category Filters */}
            <section className={styles.filterSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNumber}>02</span>
                    <h2 className={styles.glitchTitle} data-text="CATEGORIES">
                        CATEGORIES
                    </h2>
                </div>

                <div className={styles.categoryFilters}>
                    {technologiesData.categories.map((category) => (
                        <button
                            key={category.id}
                            className={`${styles.categoryBtn} ${activeCategory === category.id ? styles.active : ''
                                }`}
                            onClick={() => handleCategoryFilter(category.id)}
                            style={{ '--category-color': category.color }}
                        >
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <span className={styles.categoryName}>{category.name}</span>
                            </div>
                            <p className={styles.categoryDesc}>{category.description}</p>
                            <div className={styles.proficiencyBar}>
                                <div
                                    className={styles.proficiencyFill}
                                    style={{ width: `${category.proficiency}%`, background: category.color }}
                                />
                            </div>
                            <span className={styles.proficiencyLabel}>{category.proficiency}%</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Section 3: Technology Details */}
            <section className={styles.detailsSection}>
                <div className={styles.sectionHeader}>
                    <span className={styles.sectionNumber}>03</span>
                    <h2 className={styles.glitchTitle} data-text="TECH DETAILS">
                        TECHNOLOGY DETAILS
                    </h2>
                </div>

                <div className={styles.techGrid}>
                    {technologiesData.categories
                        .filter(cat => !activeCategory || cat.id === activeCategory)
                        .flatMap(cat => cat.technologies)
                        .map(tech => {
                            const category = technologiesData.categories.find(cat =>
                                cat.technologies.some(t => t.id === tech.id)
                            );

                            return (
                                <div
                                    key={tech.id}
                                    id={`tech-${tech.id}`}
                                    className={`${styles.techCard} ${selectedTech?.id === tech.id ? styles.selected : ''
                                        } ${highlightedTechs.includes(tech.id) ? styles.highlighted : ''
                                        }`}
                                    style={{ '--card-color': category?.color }}
                                >
                                    <div className={styles.techCardHeader}>
                                        <div className={styles.techIconLarge}>{tech.icon}</div>
                                        <div className={styles.techCardTitle}>
                                            <h3>{tech.name}</h3>
                                            <div className={styles.proficiencyBadge}>
                                                <span>{tech.proficiency}%</span>
                                                <div className={styles.proficiencyBarSmall}>
                                                    <div
                                                        className={styles.proficiencyFillSmall}
                                                        style={{ width: `${tech.proficiency}%`, background: category?.color }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className={styles.techDescription}>{tech.description}</p>

                                    {tech.keyFeatures && (
                                        <div className={styles.techFeatures}>
                                            <h4>Key Features:</h4>
                                            <ul>
                                                {tech.keyFeatures.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className={styles.techMeta}>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaIcon}>⏱️</span>
                                            <span>{tech.yearsOfExperience} years</span>
                                        </div>
                                        <div className={styles.metaItem}>
                                            <span className={styles.metaIcon}>📁</span>
                                            <span>{tech.projects.length} project{tech.projects.length !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>

                                    {tech.projects && tech.projects.length > 0 && (
                                        <div className={styles.projectTags}>
                                            {tech.projects.slice(0, 3).map((project, index) => (
                                                <span key={index} className={styles.projectTag}>
                                                    {project}
                                                </span>
                                            ))}
                                            {tech.projects.length > 3 && (
                                                <span className={styles.projectTag}>
                                                    +{tech.projects.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </section>
        </div>
    );
};

export default Technologies;
