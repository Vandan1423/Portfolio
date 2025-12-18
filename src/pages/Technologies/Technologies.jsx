import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/layouts/PageTemplate/PageTemplate';
import TechnologiesHero from './sections/TechnologiesHero';
import TechnologyTree from './sections/TechnologyTree';
import CategoryFilters from './sections/CategoryFilters';
import TechnologyCards from './sections/TechnologyCards';
import technologiesData from '../../data/technologiesData';
import styles from './Technologies.module.css';

const Technologies = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const [highlightedTechs, setHighlightedTechs] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);

    // Auto-scroll to selected tech details
    useEffect(() => {
        if (selectedTech) {
            const element = document.getElementById(`tech-${selectedTech.id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedTech]);

    const handleNodeClick = (tech) => {
        if (tech.technologies) {
            handleCategoryFilter(tech.id);
        } else {
            setSelectedTech(tech);
            setHighlightedTechs([tech.id, ...(tech.relatedTo || [])]);
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
                <div className={styles.spaceBackground} />

                <TechnologiesHero />

                <TechnologyTree
                    technologiesData={technologiesData}
                    selectedTech={selectedTech}
                    highlightedTechs={highlightedTechs}
                    onNodeClick={handleNodeClick}
                    onClearSelection={clearSelection}
                />

                <CategoryFilters
                    categories={technologiesData.categories}
                    activeCategory={activeCategory}
                    onCategoryFilter={handleCategoryFilter}
                />

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
