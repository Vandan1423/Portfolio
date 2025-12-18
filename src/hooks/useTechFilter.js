import { useState } from 'react';

const useTechFilter = () => {
    const [selectedTech, setSelectedTech] = useState(null);
    const [highlightedTechs, setHighlightedTechs] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);

    const handleNodeClick = (tech) => {
        if (tech.technologies) {
            handleCategoryFilter(tech.id);
        } else {
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

    return {
        selectedTech,
        highlightedTechs,
        activeCategory,
        hoveredNode,
        setHoveredNode,
        handleNodeClick,
        handleCategoryFilter,
        clearSelection,
    };
};

export default useTechFilter;
