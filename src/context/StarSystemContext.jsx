/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getAllStarSystems } from '../data/starSystemsData';
import { readLastView } from '../utils/lastView';

const StarSystemContext = createContext(undefined);

const starSystems = getAllStarSystems();

export function StarSystemProvider({ children }) {
    // Where the visitor last was in 3D during this tab's visit, or null
    const [initialView] = useState(readLastView);
    const [currentSystemId, setCurrentSystemId] = useState(initialView?.systemId ?? 'alpha-centauri');
    const [selectedPlanet, setSelectedPlanet] = useState(initialView?.planet ?? null);
    const [travelDestination, setTravelDestination] = useState(null);
    const [travelPhase, setTravelPhase] = useState(null);

    const currentSystem = useMemo(
        () => starSystems.find((sys) => sys.id === currentSystemId),
        [currentSystemId]
    );

    const destinationSystem = useMemo(
        () => travelDestination
            ? starSystems.find((sys) => sys.id === travelDestination)
            : null,
        [travelDestination]
    );

    const handleSystemChange = useCallback((systemId) => {
        setCurrentSystemId(systemId);
    }, []);

    const handlePlanetSelect = useCallback((planet) => {
        setSelectedPlanet(planet);
    }, []);

    const handleTravelTo = useCallback((destinationId) => {
        setTravelDestination(destinationId);
    }, []);

    const value = {
        initialView,
        currentSystemId,
        selectedPlanet,
        travelDestination,
        travelPhase,
        currentSystem,
        destinationSystem,
        starSystems,
        setCurrentSystemId: handleSystemChange,
        setSelectedPlanet: handlePlanetSelect,
        setTravelDestination: handleTravelTo,
        setTravelPhase,
    };

    return (
        <StarSystemContext.Provider value={value}>
            {children}
        </StarSystemContext.Provider>
    );
}

export function useStarSystem() {
    const context = useContext(StarSystemContext);
    if (context === undefined) {
        throw new Error('useStarSystem must be used within a StarSystemProvider');
    }
    return context;
}
