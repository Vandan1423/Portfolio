import { motion } from "framer-motion";

/**
 * AboutMe Page Component
 *
 * 2D React page showing portfolio content after landing animation
 * Currently displays placeholder content - will be filled with actual portfolio data
 *
 * Props:
 * @param {object} planet - Planet data (optional, for theming)
 * @param {function} onBack - Callback to return to 3D portfolio
 */
const AboutMe = ({ planet, onBack }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen bg-gradient-to-b from-deep-space via-black to-deep-space overflow-y-auto"
        >
            {/* Header */}
            <header className="relative z-10 p-8">
                <button
                    onClick={onBack}
                    className="group flex items-center space-x-2 px-4 py-2
                        bg-cyan-500/10 border border-cyan-500/50 rounded-lg
                        hover:bg-cyan-500/20 hover:border-cyan-400 transition-all"
                >
                    <span className="text-cyan-400 text-xl group-hover:-translate-x-1 transition-transform">
                        ←
                    </span>
                    <span className="text-cyan-400 font-mono uppercase tracking-wider">
                        Return to Exploration
                    </span>
                </button>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-8 py-16">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center space-y-8"
                >
                    <h1 className="text-6xl font-bold text-cyan-400 mb-4">
                        AboutMe Page
                    </h1>

                    {planet && (
                        <p className="text-2xl text-gray-400 font-mono">
                            Welcome to{" "}
                            <span style={{ color: planet.orbitColor }}>
                                {planet.name}
                            </span>
                        </p>
                    )}

                    <div className="mt-12 p-8 bg-black/50 border border-cyan-500/30 rounded-lg">
                        <p className="text-gray-300 text-lg leading-relaxed">
                            This is a placeholder for the AboutMe page content.
                            Eventually this will contain full portfolio
                            information, projects, skills, and contact details.
                        </p>
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
                <div
                    className="flex items-center space-x-4 px-6 py-3
                    bg-black/70 backdrop-blur-md border border-cyan-500/30 rounded-full"
                >
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-cyan-400 font-mono text-sm">
                        LANDING SUCCESSFUL
                    </span>
                </div>
            </footer>
        </motion.div>
    );
};

export default AboutMe;
