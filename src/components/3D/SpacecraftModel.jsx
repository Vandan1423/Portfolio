import { useGLTF } from "@react-three/drei";
import { useMemo, forwardRef } from "react";

/**
 * SpacecraftModel Component
 *
 * Reusable spacecraft model component (SpaceshipCockpit.glb)
 * Loads and displays the 3D spacecraft model with cloning to avoid side effects
 *
 * Props:
 * @param {number} scale - Model scale (default: 1)
 * @param {array} position - Position [x, y, z] (default: [0, 0, 0])
 * @param {array} rotation - Rotation [x, y, z] in radians (default: [0, 0, 0])
 */
const SpacecraftModel = forwardRef(
    ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }, ref) => {
        const { scene } = useGLTF("/models/SpaceshipCockpit.glb");

        // Clone to avoid side effects with other uses of this model
        // (e.g., cockpit interior view uses same model)
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
