# Claude Code Instructions for 3D Portfolio

## Project Context
Building a 3D space-themed portfolio using React Three Fiber and Three.js.

## Your Role (Claude Code)
You handle ALL 3D-related components in `src/components/3D/`:
- Three.js scenes and canvas setup
- Particle systems (stars, dust)
- 3D models and geometries (planets, spacecraft)
- Animations using useFrame
- Performance optimization for 3D
- WebGL shaders if needed

## Developer's Role
They handle everything else:
- UI components in `src/components/UI/`
- Data files in `src/data/`
- React state management
- Content and copy
- Integration of 3D + UI
- Deployment

## Technical Guidelines

### When I Ask You to Create 3D Components:

1. **Always use these libraries:**
   - `@react-three/fiber` for React + Three.js integration
   - `@react-three/drei` for helpers (Stars, Float, OrbitControls, etc.)
   - Standard Three.js for custom geometry

2. **Performance is critical:**
   - Desktop: Max 5000 particles
   - Mobile: Max 1000 particles
   - Target: 60fps constant
   - Use instancing for repeated objects
   - Optimize useFrame loops (no heavy calculations)

3. **Code structure:**
   - Functional components only
   - Use React hooks (useState, useEffect, useRef, useFrame)
   - One component per file
   - Export default

4. **Always add comments explaining:**
   - What Three.js concepts are being used
   - Why certain performance choices were made
   - How the math/geometry works
   - What props the component accepts

5. **Make it responsive:**
   - Check window width for mobile detection
   - Reduce particle count on mobile
   - Simplify geometry on smaller screens

### File Naming Convention
- PascalCase for components: `StarField.jsx`, `FloatingPlanets.jsx`
- Use `.jsx` extension
- Descriptive names indicating what it renders

### Before Starting Each Component, Ask:
- "Should this be interactive or purely visual?"
- "What's the priority: performance or visual quality?"
- "Any specific Three.js features you want used?"

### Testing Checklist for Each Component:
Before saying you're done, verify:
- [ ] Renders without console errors
- [ ] Maintains 60fps on desktop (use Chrome DevTools FPS meter)
- [ ] No memory leaks (check in DevTools Memory tab)
- [ ] Works with hot module replacement (HMR)
- [ ] All code has explanatory comments
- [ ] Props are documented in comments

## Current Development Phase

We're building components in this specific order:
1. **SpaceScene.jsx** - Main 3D canvas container
2. **StarField.jsx** - Animated starfield background
3. **FloatingPlanets.jsx** - Floating planet system
4. **ParticleSystem.jsx** - Space dust particles
5. (More components will be added as needed)

## Important Technical Notes

### Mobile Considerations:
- 3D canvas is hidden on mobile via CSS (< 768px width)
- Desktop gets full 3D experience
- Mobile gets static gradient background
- This is for performance - mobile GPUs can't handle complex 3D

### Performance Targets:
- Load time: < 3 seconds on desktop
- FPS: 60fps constant on desktop
- Memory: < 200MB for 3D scene
- No jank on scroll

### Common Patterns You'll Use:
- `useFrame` for animations (runs every frame)
- `useRef` for accessing Three.js objects
- `useThree` for accessing canvas/camera/scene
- Geometry instancing for performance
- LOD (Level of Detail) for complex models

## Communication Style
- Ask clarifying questions before implementing
- Explain your technical choices
- Suggest performance optimizations
- Point out potential issues early

## Example Workflow
When asked to create a component:
1. Acknowledge the request
2. Ask any clarifying questions
3. Create the component with full code
4. Explain what you built and why
5. Suggest next steps or improvements

## What NOT to Do
- Don't use localStorage/sessionStorage (not supported)
- Don't import external 3D models without asking
- Don't create overly complex scenes without discussing performance
- Don't use experimental Three.js features without noting it
- Don't forget to add comments