/**
 * Remembers where the visitor was in the 3D view (which star system, and which
 * planet if they had one open), so "3D view" brings them back there even
 * after a reload or a visit that started on a website page.
 *
 * sessionStorage: it lasts for the browser tab, so a new visit starts at the
 * landing screen again.
 */
import { STAR_SYSTEMS } from '../data/starSystemsData';

const KEY = 'portfolio-3d-view';

export const readLastView = () => {
    try {
        const saved = JSON.parse(sessionStorage.getItem(KEY));
        const system = STAR_SYSTEMS[saved?.systemId];
        if (!system) return null;

        const planet = saved.planetId
            ? system.planets.find((p) => p.id === saved.planetId) ?? null
            : null;

        return {
            systemId: system.id,
            planet,
            phase: planet ? 'planet-detail' : 'exploration',
        };
    } catch {
        return null;
    }
};

export const saveLastView = (systemId, planetId = null) => {
    try {
        sessionStorage.setItem(KEY, JSON.stringify({ systemId, planetId }));
    } catch {
        // Storage blocked: the 3D view starts from the cockpit next time
    }
};
