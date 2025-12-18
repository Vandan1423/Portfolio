import { useGLTF } from "@react-three/drei";
import { useMemo, forwardRef } from "react";

// Spacecraft model path
const SPACECRAFT_MODEL_PATH = "/models/SpaceshipCockpit.glb";

/**
 * SpacecraftModel Component
 *
 * Reusable spacecraft model component
 * Clones scene to avoid side effects when used in multiple locations
 *
 * @param {number} scale - Model scale
 * @param {array} position - Position [x, y, z]
 * @param {array} rotation - Rotation [x, y, z] in radians
 * @param {object} ref - Forward ref for parent control
 */
const SpacecraftModel = forwardRef(
    ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
        const { scene } = useGLTF(SPACECRAFT_MODEL_PATH);

        // Clone to avoid side effects with other uses of this model
        const clonedScene = useMemo(() => scene.clone(), [scene]);

        return (
            <primitive
                ref={ref}
                object={clonedScene}
                scale={scale}
                position={position}
                rotation={rotation}
            />
        );
    }
);

SpacecraftModel.displayName = "SpacecraftModel";

export default SpacecraftModel;
