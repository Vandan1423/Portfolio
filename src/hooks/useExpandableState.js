import { useState, useCallback } from 'react';

/**
 * Custom hook to manage expandable/collapsible state for items
 * Used in Projects and Experience pages for "Read More" functionality
 *
 * @returns {Object} { expandedItems, isExpanded, toggle, toggleAll, collapseAll }
 */
const useExpandableState = () => {
    const [expandedItems, setExpandedItems] = useState({});

    const isExpanded = useCallback((id) => {
        return !!expandedItems[id];
    }, [expandedItems]);

    const toggle = useCallback((id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    }, []);

    const toggleAll = useCallback((ids, value) => {
        const newState = {};
        ids.forEach(id => {
            newState[id] = value;
        });
        setExpandedItems(newState);
    }, []);

    const collapseAll = useCallback(() => {
        setExpandedItems({});
    }, []);

    return {
        expandedItems,
        isExpanded,
        toggle,
        toggleAll,
        collapseAll,
    };
};

export default useExpandableState;
