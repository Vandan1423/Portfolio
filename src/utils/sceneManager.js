/**
 * Scene Manager
 * Handles switching between different 3D scenes/solar systems
 */

export const SCENES = {
    LAUNCH_PAD: "launch_pad",
    HOME_SYSTEM: "home_system",
    PROJECTS_SYSTEM: "projects_system",
    WORMHOLE: "wormhole_travel",
};

export class SceneManager {
    constructor() {
        this.currentScene = SCENES.LAUNCH_PAD;
        this.previousScene = null;
        this.isTransitioning = false;
    }

    switchScene(newScene, callback) {
        if (this.isTransitioning) return;

        this.isTransitioning = true;
        this.previousScene = this.currentScene;

        // Simulate scene transition
        setTimeout(() => {
            this.currentScene = newScene;
            this.isTransitioning = false;
            if (callback) callback();
        }, 2000); // 2 second transition
    }

    getCurrentScene() {
        return this.currentScene;
    }

    goBack() {
        if (this.previousScene) {
            this.switchScene(this.previousScene);
        }
    }
}

export const sceneManager = new SceneManager();