import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import styles from './Technologies.module.css';
import technologiesData from '../../data/technologiesData';

// Import section components
import TechnologiesHero from './sections/TechnologiesHero';
import TechnologyTree from './sections/TechnologyTree';
import CategoryFilters from './sections/CategoryFilters';
import TechnologyCards from './sections/TechnologyCards';

/**
 * Technologies Page Component
 * Main page component that orchestrates all technology-related sections
 * Manages state for selected tech, highlights, and active category filter
 */
const Technologies = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const [highlightedTechs, setHighlightedTechs] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

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

    return (
        <PageTemplate
            title="Technologies"
            subtitle="Explore my technical ecosystem"
            showHero={false}
            className={styles.pageContainer}
        >
            <div className={styles.container}>
                {/* Background */}
                <div className={styles.spaceBackground}></div>

                {/* Hero Section */}
                <TechnologiesHero />

                {/* Section 1: Interactive Tree Visualization */}
                <TechnologyTree
                    technologiesData={technologiesData}
                    selectedTech={selectedTech}
                    highlightedTechs={highlightedTechs}
                    onNodeClick={handleNodeClick}
                    onClearSelection={clearSelection}
                />

                {/* Section 2: Category Filters */}
                <CategoryFilters
                    categories={technologiesData.categories}
                    activeCategory={activeCategory}
                    onCategoryFilter={handleCategoryFilter}
                />

                {/* Section 3: Technology Details */}
                <TechnologyCards
                    technologiesData={technologiesData}
                    activeCategory={activeCategory}
                    selectedTech={selectedTech}
                    highlightedTechs={highlightedTechs}
                />
            </div>
        </PageTemplate>
    );
};

export default Technologies;
