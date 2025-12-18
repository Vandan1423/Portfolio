/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getAllStarSystems } from '../data/starSystemsData';

const StarSystemContext = createContext(undefined);

const starSystems = getAllStarSystems();

export function StarSystemProvider({ children }) {
    const [currentSystemId, setCurrentSystemId] = useState('alpha-centauri');
    const [selectedPlanet, setSelectedPlanet] = useState(null);
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
