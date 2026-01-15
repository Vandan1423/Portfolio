import { useRef, useMemo, forwardRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { 
    Color, 
    Vector2, 
    LatheGeometry, 
    CylinderGeometry, 
    DoubleSide, 
    AdditiveBlending, 
    BackSide 
} from "three";
import { shaderMaterial } from "@react-three/drei";

// Geometry configuration
const THROAT_SEGMENTS = 64;
const THROAT_LATHE_SEGMENTS = 64;
const THROAT_LENGTH = 8;
const THROAT_RADIUS_MULTIPLIER = 0.25;
const THROAT_BASE_RADIUS = 1.0;

const TUNNEL_RADIUS = 0.8;
const TUNNEL_LENGTH = 7;
const TUNNEL_RADIAL_SEGMENTS = 32;

const PORTAL_RADIUS = 4;
const PORTAL_SEGMENTS = 128;
const PORTAL_Z_OFFSET = 4.2;

const RIM_INNER_RADIUS = 2.8;
const RIM_OUTER_RADIUS = 4.2;
const RIM_SEGMENTS = 128;
const RIM_Z_OFFSET = 4.4;

// Particle configuration
const PARTICLE_COUNT = 600;
const PARTICLE_MIN_RADIUS = 2.5;
const PARTICLE_RADIUS_RANGE = 2.5;
const PARTICLE_HEIGHT_VARIATION = 2;
const PARTICLE_Z_DISTANCE = 4.5;
const PARTICLE_SIZE = 0.12;
const PARTICLE_OPACITY = 0.9;
const PARTICLE_MIN_SPEED = 0.3;
const PARTICLE_SPEED_RANGE = 0.7;
const PARTICLE_ROTATION_SPEED = 0.015;
const PARTICLE_WAVE_AMPLITUDE = 0.8;
const PARTICLE_BRIGHTNESS_MIN = 0.6;
const PARTICLE_BRIGHTNESS_RANGE = 0.4;

const SPARKLE_COUNT = 150;
const SPARKLE_MIN_RADIUS = 5;
const SPARKLE_RADIUS_RANGE = 4;
const SPARKLE_Z_VARIATION = 12;
const SPARKLE_ROTATION_SPEED = 0.001;
const SPARKLE_PULSE_SPEED = 3;
const SPARKLE_OPACITY_BASE = 0.7;
const SPARKLE_OPACITY_AMPLITUDE = 0.3;

// Animation speeds
const WORMHOLE_ROTATION_SPEED = 0.03;

// Lighting configuration
const LIGHT_CORE_INTENSITY = 2;
const LIGHT_CORE_DISTANCE = 15;

const LIGHT_RIM_INTENSITY = 8;
const LIGHT_RIM_DISTANCE = 10;
const LIGHT_RIM_Z_OFFSET = 4.5;

const LIGHT_ACCENT_INTENSITY = 3;
const LIGHT_ACCENT_DISTANCE = 8;
const LIGHT_ACCENT_OFFSET = 3;
const LIGHT_ACCENT_Z_OFFSET = 4;

const LIGHT_SIDE_INTENSITY = 2;
const LIGHT_SIDE_DISTANCE = 12;
const LIGHT_SIDE_OFFSET = 6;

/**
 * Procedural Wormhole Component
 *
 * Features:
 * - Ultra-bright rim edges
 * - Transparent center showing tunnel
 * - Visible throat structure
 * - Particle effects
 * - Multiple color schemes
 */

// ============================================
// SHADER: Main Vortex Disk (Transparent center)
// ============================================
const VortexDiskMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorCore: new Color("#001a33"),
        uColorMid: new Color("#00aaff"),
        uColorOuter: new Color("#00ffff"),
        uColorHighlight: new Color("#ffffff"),
    },
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
        vUv = uv;
        vPosition = position;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float uTime;
    uniform vec3 uColorCore;
    uniform vec3 uColorMid;
    uniform vec3 uColorOuter;
    uniform vec3 uColorHighlight;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    #define PI 3.14159265359
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                          -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
            + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }
    
    float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 6; i++) {
            value += amplitude * snoise(p * frequency);
            amplitude *= 0.5;
            frequency *= 2.0;
        }
        return value;
    }
    
    void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float angle = atan(center.y, center.x);
        
        // Spiral arms
        float spiral1 = angle * 2.0 + dist * 12.0 - uTime * 2.0;
        float spiral2 = angle * 3.0 - dist * 8.0 + uTime * 1.5;
        float spiral3 = angle * 5.0 + dist * 15.0 - uTime * 3.0;
        
        float arms = sin(spiral1) * 0.5 + 0.5;
        arms += sin(spiral2) * 0.3;
        arms += sin(spiral3) * 0.2;
        arms = clamp(arms, 0.0, 1.0);
        
        // Turbulence
        vec2 turbCoord = center * 3.0 + vec2(cos(uTime * 0.3), sin(uTime * 0.4)) * 0.5;
        float turb = fbm(turbCoord + uTime * 0.2);
        
        // TRANSPARENT CENTER - key change!
        float centerHole = smoothstep(0.12, 0.35, dist);
        
        // Bright rim edge
        float rimGlow = smoothstep(0.3, 0.45, dist) * smoothstep(0.55, 0.45, dist);
        rimGlow = pow(rimGlow, 0.5);
        
        // Pattern with transparent center
        float pattern = arms * centerHole;
        pattern += turb * 0.2 * centerHole;
        pattern = clamp(pattern, 0.0, 1.0);
        
        // Color
        vec3 color = mix(uColorMid, uColorOuter, smoothstep(0.2, 0.5, dist));
        color += uColorHighlight * pow(pattern, 2.0) * 0.4;
        color += uColorHighlight * rimGlow * 1.5;
        color += uColorOuter * rimGlow * 0.8;
        
        // Alpha - transparent center!
        float alpha = smoothstep(0.55, 0.4, dist);
        alpha *= centerHole;
        alpha *= 0.6 + pattern * 0.4;
        alpha += rimGlow * 0.5;
        
        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ VortexDiskMaterial });

// ============================================
// SHADER: Ultra-Bright Rim Ring
// ============================================
const RimGlowMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new Color("#00ffff"),
        uColorBright: new Color("#ffffff"),
    },
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uColorBright;
    varying vec2 vUv;
    
    void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float angle = atan(center.y, center.x);
        
        // Main bright ring
        float ring = smoothstep(0.35, 0.45, dist) * smoothstep(0.55, 0.45, dist);
        ring = pow(ring, 0.3);
        
        // Inner edge - brightest
        float innerEdge = smoothstep(0.42, 0.38, dist) * smoothstep(0.34, 0.38, dist);
        innerEdge = pow(innerEdge, 0.5);
        
        // Shimmer
        float shimmer = sin(angle * 8.0 + uTime * 3.0) * 0.15 + 0.85;
        float pulse = sin(uTime * 2.0) * 0.1 + 0.9;
        
        vec3 color = mix(uColor, uColorBright, innerEdge);
        color *= shimmer * pulse;
        color += uColorBright * innerEdge * 0.5;
        
        float alpha = ring * shimmer + innerEdge * 0.8;
        
        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ RimGlowMaterial });

// ============================================
// SHADER: Corona/Flame Effect
// ============================================
const CoronaMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new Color("#00ffff"),
    },
    `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(noise(i), noise(i + vec2(1,0)), f.x),
                   mix(noise(i + vec2(0,1)), noise(i + vec2(1,1)), f.x), f.y);
    }
    
    float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 6; i++) {
            v += a * smoothNoise(p);
            p *= 2.0;
            a *= 0.5;
        }
        return v;
    }
    
    void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float angle = atan(center.y, center.x);
        
        float flames = fbm(vec2(angle * 4.0 + uTime * 0.5, dist * 6.0 - uTime * 2.0));
        flames += fbm(vec2(angle * 6.0 - uTime * 0.3, dist * 10.0 + uTime * 1.5)) * 0.5;
        flames += fbm(vec2(angle * 8.0 + uTime * 0.7, dist * 4.0 - uTime)) * 0.25;
        
        float innerRadius = 0.38 - flames * 0.03;
        float outerRadius = 0.5 + flames * 0.1;
        
        float ring = smoothstep(innerRadius, innerRadius + 0.03, dist);
        ring *= smoothstep(outerRadius + 0.15, outerRadius, dist);
        
        float intensity = ring * (0.5 + flames * 0.5);
        
        vec3 color = uColor * (1.0 + flames * 0.5);
        color += vec3(1.0) * pow(flames, 3.0) * 0.3;
        
        float alpha = intensity * 0.6;
        
        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ CoronaMaterial });

// ============================================
// SHADER: Throat/Tunnel (visible through portal)
// ============================================
const ThroatMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor1: new Color("#00ffff"),
        uColor2: new Color("#0066ff"),
    },
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(noise(i), noise(i + vec2(1,0)), f.x),
                   mix(noise(i + vec2(0,1)), noise(i + vec2(1,1)), f.x), f.y);
    }
    
    void main() {
        float stream1 = sin(vUv.y * 40.0 - uTime * 5.0 + vUv.x * 15.0);
        float stream2 = sin(vUv.y * 25.0 + uTime * 4.0 - vUv.x * 12.0);
        float stream3 = sin(vUv.y * 60.0 - uTime * 6.0 + vUv.x * 20.0);
        float streams = (stream1 + stream2 * 0.7 + stream3 * 0.4) * 0.2 + 0.5;
        
        float n = smoothNoise(vec2(vUv.x * 10.0, vUv.y * 5.0 - uTime));
        streams += n * 0.2;
        
        float pulse = sin(uTime * 3.0 + vUv.y * 8.0) * 0.2 + 0.8;
        float edgeFade = pow(sin(vUv.x * 3.14159), 0.5);
        float streaks = pow(streams, 3.0);
        
        vec3 color = mix(uColor2, uColor1, streams);
        color *= pulse;
        color += vec3(1.0) * streaks * 0.3;
        
        float alpha = (streams * 0.6 + streaks * 0.3) * edgeFade * pulse;
        alpha = clamp(alpha, 0.0, 0.8);
        
        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ ThroatMaterial });

// ============================================
// SHADER: Inner Tunnel Glow
// ============================================
const TunnelGlowMaterial = shaderMaterial(
    {
        uTime: 0,
        uColor: new Color("#0088ff"),
    },
    `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
        float depth = 1.0 - abs(vPosition.y) / 4.0;
        depth = clamp(depth, 0.0, 1.0);
        
        float edgeGlow = pow(sin(vUv.x * 3.14159), 2.0);
        float flow = sin(vUv.y * 20.0 - uTime * 3.0) * 0.5 + 0.5;
        
        vec3 color = uColor * (0.5 + flow * 0.5);
        color += vec3(0.3, 0.6, 1.0) * edgeGlow * 0.3;
        
        float alpha = edgeGlow * depth * 0.4 * (0.7 + flow * 0.3);
        
        gl_FragColor = vec4(color, alpha);
    }
    `
);

extend({ TunnelGlowMaterial });

/**
 * ProceduralWormhole Component - Fixed Version
 */
const Wormhole = forwardRef(({
    position = [0, 0, 0],
    scale = 1,
    rotation = [0, 0, 0],
    colorScheme = "cyan",
}, ref) => {
    const groupRef = ref || useRef();
    const vortexFrontRef = useRef();
    const vortexBackRef = useRef();
    const rimFrontRef = useRef();
    const rimBackRef = useRef();
    const coronaFrontRef = useRef();
    const coronaBackRef = useRef();
    const throatRef = useRef();
    const tunnelGlowRef = useRef();
    const particlesRef = useRef();
    const sparklesRef = useRef();

    const colors = useMemo(() => {
        const schemes = {
            cyan: {
                core: "#001a33",
                mid: "#00aaff",
                outer: "#00ffff",
                highlight: "#ffffff",
                corona: "#ffffff",
                throat1: "#00ffff",
                throat2: "#0066ff",
                tunnel: "#0088ff",
            },
            purple: {
                core: "#1a0033",
                mid: "#8800ff",
                outer: "#cc66ff",
                highlight: "#ffffff",
                corona: "#aa00ff",
                throat1: "#cc66ff",
                throat2: "#6600aa",
                tunnel: "#8844cc",
            },
            orange: {
                core: "#331a00",
                mid: "#ff6600",
                outer: "#ffaa00",
                highlight: "#ffffff",
                corona: "#ff8800",
                throat1: "#ffaa00",
                throat2: "#ff4400",
                tunnel: "#ff6622",
            },
        };
        return schemes[colorScheme] || schemes.cyan;
    }, [colorScheme]);

    // Throat geometry (hourglass)
    const throatGeometry = useMemo(() => {
        const points = [];

        for (let i = 0; i <= THROAT_SEGMENTS; i++) {
            const t = i / THROAT_SEGMENTS;
            const z = (t - 0.5) * THROAT_LENGTH;
            const radius = Math.sqrt(
                THROAT_BASE_RADIUS * THROAT_BASE_RADIUS +
                z * z * THROAT_RADIUS_MULTIPLIER
            );
            points.push(new Vector2(radius, z));
        }

        return new LatheGeometry(points, THROAT_LATHE_SEGMENTS);
    }, []);

    // Inner tunnel cylinder
    const tunnelGeometry = useMemo(() => {
        return new CylinderGeometry(
            TUNNEL_RADIUS,
            TUNNEL_RADIUS,
            TUNNEL_LENGTH,
            TUNNEL_RADIAL_SEGMENTS,
            1,
            true
        );
    }, []);

    // Particles
    const particleData = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const velocities = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const i3 = i * 3;
            const side = Math.random() > 0.5 ? 1 : -1;
            const angle = Math.random() * Math.PI * 2;
            const radius = PARTICLE_MIN_RADIUS + Math.random() * PARTICLE_RADIUS_RANGE;
            const heightOffset = (Math.random() - 0.5) * PARTICLE_HEIGHT_VARIATION;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = side * PARTICLE_Z_DISTANCE + heightOffset;

            const brightness = PARTICLE_BRIGHTNESS_MIN + Math.random() * PARTICLE_BRIGHTNESS_RANGE;
            colors[i3] = 0.3 * brightness;
            colors[i3 + 1] = 0.9 * brightness;
            colors[i3 + 2] = brightness;

            velocities.push({
                speed: PARTICLE_MIN_SPEED + Math.random() * PARTICLE_SPEED_RANGE,
                phase: Math.random() * Math.PI * 2,
            });
        }

        return { positions, colors, velocities, count: PARTICLE_COUNT };
    }, []);

    // Sparkles
    const sparkleData = useMemo(() => {
        const positions = new Float32Array(SPARKLE_COUNT * 3);
        const phases = new Float32Array(SPARKLE_COUNT);

        for (let i = 0; i < SPARKLE_COUNT; i++) {
            const i3 = i * 3;
            const angle = Math.random() * Math.PI * 2;
            const radius = SPARKLE_MIN_RADIUS + Math.random() * SPARKLE_RADIUS_RANGE;
            const z = (Math.random() - 0.5) * SPARKLE_Z_VARIATION;

            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = Math.sin(angle) * radius;
            positions[i3 + 2] = z;
            phases[i] = Math.random() * Math.PI * 2;
        }

        return { positions, phases, count: SPARKLE_COUNT };
    }, []);

    // Animation
    useFrame((state) => {
        const time = state.clock.elapsedTime;

        if (groupRef.current) {
            groupRef.current.rotation.z = time * WORMHOLE_ROTATION_SPEED;
        }

        // Update shader uniforms
        [vortexFrontRef, vortexBackRef, rimFrontRef, rimBackRef, coronaFrontRef, coronaBackRef].forEach((ref) => {
            if (ref.current) ref.current.uTime = time;
        });

        if (throatRef.current) throatRef.current.uTime = time;
        if (tunnelGlowRef.current) tunnelGlowRef.current.uTime = time;

        // Animate particles
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array;

            for (let i = 0; i < particleData.count; i++) {
                const i3 = i * 3;
                const vel = particleData.velocities[i];

                const x = positions[i3];
                const y = positions[i3 + 1];
                const z = positions[i3 + 2];

                const currentAngle = Math.atan2(y, x);
                const radius = Math.sqrt(x * x + y * y);

                const newAngle = currentAngle + vel.speed * PARTICLE_ROTATION_SPEED;
                positions[i3] = Math.cos(newAngle) * radius;
                positions[i3 + 1] = Math.sin(newAngle) * radius;

                const side = z > 0 ? 1 : -1;
                positions[i3 + 2] = side * PARTICLE_Z_DISTANCE + Math.sin(time * vel.speed + vel.phase) * PARTICLE_WAVE_AMPLITUDE;
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }

        // Animate sparkles
        if (sparklesRef.current) {
            const positions = sparklesRef.current.geometry.attributes.position.array;

            for (let i = 0; i < sparkleData.count; i++) {
                const i3 = i * 3;
                const x = positions[i3];
                const y = positions[i3 + 1];
                const angle = Math.atan2(y, x) + SPARKLE_ROTATION_SPEED;
                const radius = Math.sqrt(x * x + y * y);

                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 1] = Math.sin(angle) * radius;
            }

            sparklesRef.current.geometry.attributes.position.needsUpdate = true;
            sparklesRef.current.material.opacity = Math.sin(time * SPARKLE_PULSE_SPEED) * SPARKLE_OPACITY_AMPLITUDE + SPARKLE_OPACITY_BASE;
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            scale={scale}
            rotation={rotation}
        >
            {/* === TUNNEL (visible through portal center) === */}

            <mesh geometry={tunnelGeometry} rotation={[Math.PI / 2, 0, 0]}>
                <tunnelGlowMaterial
                    ref={tunnelGlowRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColor={new Color(colors.tunnel)}
                />
            </mesh>

            <mesh geometry={throatGeometry} rotation={[Math.PI / 2, 0, 0]}>
                <throatMaterial
                    ref={throatRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColor1={new Color(colors.throat1)}
                    uColor2={new Color(colors.throat2)}
                />
            </mesh>

            <mesh geometry={throatGeometry} rotation={[Math.PI / 2, 0, 0]}>
                <meshBasicMaterial
                    color={colors.core}
                    transparent
                    opacity={0.3}
                    side={BackSide}
                />
            </mesh>

            {/* Front portal */}
            <mesh position={[0, 0, PORTAL_Z_OFFSET]}>
                <circleGeometry args={[PORTAL_RADIUS, PORTAL_SEGMENTS]} />
                <vortexDiskMaterial
                    ref={vortexFrontRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColorCore={new Color(colors.core)}
                    uColorMid={new Color(colors.mid)}
                    uColorOuter={new Color(colors.outer)}
                    uColorHighlight={new Color(colors.highlight)}
                />
            </mesh>

            {/* Front rim */}
            <mesh position={[0, 0, RIM_Z_OFFSET]}>
                <ringGeometry args={[RIM_INNER_RADIUS, RIM_OUTER_RADIUS, RIM_SEGMENTS]} />
                <rimGlowMaterial
                    ref={rimFrontRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColor={new Color(colors.outer)}
                    uColorBright={new Color(colors.highlight)}
                />
            </mesh>

            {/* Back portal */}
            <mesh position={[0, 0, -PORTAL_Z_OFFSET]} rotation={[0, Math.PI, 0]}>
                <circleGeometry args={[PORTAL_RADIUS, PORTAL_SEGMENTS]} />
                <vortexDiskMaterial
                    ref={vortexBackRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColorCore={new Color(colors.core)}
                    uColorMid={new Color(colors.mid)}
                    uColorOuter={new Color(colors.outer)}
                    uColorHighlight={new Color(colors.highlight)}
                />
            </mesh>

            {/* Back rim */}
            <mesh position={[0, 0, -RIM_Z_OFFSET]} rotation={[0, Math.PI, 0]}>
                <ringGeometry args={[RIM_INNER_RADIUS, RIM_OUTER_RADIUS, RIM_SEGMENTS]} />
                <rimGlowMaterial
                    ref={rimBackRef}
                    transparent
                    side={DoubleSide}
                    depthWrite={false}
                    blending={AdditiveBlending}
                    uColor={new Color(colors.outer)}
                    uColorBright={new Color(colors.highlight)}
                />
            </mesh>

            {/* === PARTICLES === */}

            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particleData.count}
                        array={particleData.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particleData.count}
                        array={particleData.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={PARTICLE_SIZE}
                    vertexColors
                    transparent
                    opacity={PARTICLE_OPACITY}
                    sizeAttenuation
                    blending={AdditiveBlending}
                    depthWrite={false}
                />
            </points>
            {/* === LIGHTING === */}

            {/* Core */}
            <pointLight
                position={[0, 0, 0]}
                color={colors.tunnel}
                intensity={LIGHT_CORE_INTENSITY}
                distance={LIGHT_CORE_DISTANCE}
            />

            {/* Portal rims */}
            {[LIGHT_RIM_Z_OFFSET, -LIGHT_RIM_Z_OFFSET].map((z, i) => (
                <pointLight
                    key={`rim-${i}`}
                    position={[0, 0, z]}
                    color={colors.outer}
                    intensity={LIGHT_RIM_INTENSITY}
                    distance={LIGHT_RIM_DISTANCE}
                />
            ))}

            {/* Front rim accents */}
            {[
                [LIGHT_ACCENT_OFFSET, 0, LIGHT_ACCENT_Z_OFFSET],
                [-LIGHT_ACCENT_OFFSET, 0, LIGHT_ACCENT_Z_OFFSET],
                [0, LIGHT_ACCENT_OFFSET, LIGHT_ACCENT_Z_OFFSET],
                [0, -LIGHT_ACCENT_OFFSET, LIGHT_ACCENT_Z_OFFSET],
            ].map((pos, i) => (
                <pointLight
                    key={`front-accent-${i}`}
                    position={pos}
                    color={colors.highlight}
                    intensity={LIGHT_ACCENT_INTENSITY}
                    distance={LIGHT_ACCENT_DISTANCE}
                />
            ))}

            {/* Back rim accents */}
            {[
                [LIGHT_ACCENT_OFFSET, 0, -LIGHT_ACCENT_Z_OFFSET],
                [-LIGHT_ACCENT_OFFSET, 0, -LIGHT_ACCENT_Z_OFFSET],
                [0, LIGHT_ACCENT_OFFSET, -LIGHT_ACCENT_Z_OFFSET],
                [0, -LIGHT_ACCENT_OFFSET, -LIGHT_ACCENT_Z_OFFSET],
            ].map((pos, i) => (
                <pointLight
                    key={`back-accent-${i}`}
                    position={pos}
                    color={colors.highlight}
                    intensity={LIGHT_ACCENT_INTENSITY}
                    distance={LIGHT_ACCENT_DISTANCE}
                />
            ))}

            {/* Side lights */}
            {[LIGHT_SIDE_OFFSET, -LIGHT_SIDE_OFFSET].map((x, i) => (
                <pointLight
                    key={`side-${i}`}
                    position={[x, 0, 0]}
                    color={colors.throat2}
                    intensity={LIGHT_SIDE_INTENSITY}
                    distance={LIGHT_SIDE_DISTANCE}
                />
            ))}
        </group>
    );
});

Wormhole.displayName = 'Wormhole';

export default Wormhole;
