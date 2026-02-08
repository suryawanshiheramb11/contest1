import { useState, useEffect, useCallback, useRef } from 'react';

// Fullscreen enforcement component for exam security
function FullscreenEnforcer({ children, enabled = true }) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warningCount, setWarningCount] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const maxWarnings = 3;
    const containerRef = useRef(null);

    const enterFullscreen = useCallback(async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
        } catch (error) {
            console.error('Failed to enter fullscreen:', error);
        }
    }, []);

    const handleFullscreenChange = useCallback(() => {
        const fullscreenElement = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        const isFullscreenNow = !!fullscreenElement;
        setIsFullscreen(isFullscreenNow);

        if (!isFullscreenNow && enabled) {
            // User exited fullscreen
            const newCount = warningCount + 1;
            setWarningCount(newCount);
            setShowWarning(true);

            // Auto re-enter fullscreen after warning
            setTimeout(() => {
                enterFullscreen();
            }, 2000);
        }
    }, [enabled, warningCount, enterFullscreen]);

    // Detect visibility change (tab switch, minimize)
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden && enabled) {
            const newCount = warningCount + 1;
            setWarningCount(newCount);
            setShowWarning(true);
        }
    }, [enabled, warningCount]);

    // Block right-click context menu
    const handleContextMenu = useCallback((e) => {
        if (enabled) {
            e.preventDefault();
        }
    }, [enabled]);

    // Detect keyboard shortcuts that might break fullscreen
    const handleKeyDown = useCallback((e) => {
        if (!enabled) return;

        // Block certain key combinations
        const blockedKeys = ['F12', 'Escape'];
        const blockedCombos = [
            { ctrl: true, shift: true, key: 'I' }, // Dev Tools
            { ctrl: true, shift: true, key: 'J' }, // Console
            { ctrl: true, key: 'u' }, // View source
            { alt: true, key: 'Tab' }, // Alt+Tab
            { meta: true, key: 'Tab' }, // Cmd+Tab (Mac)
        ];

        if (blockedKeys.includes(e.key)) {
            e.preventDefault();
            return;
        }

        for (const combo of blockedCombos) {
            const matches =
                (!combo.ctrl || e.ctrlKey) &&
                (!combo.shift || e.shiftKey) &&
                (!combo.alt || e.altKey) &&
                (!combo.meta || e.metaKey) &&
                e.key.toLowerCase() === combo.key.toLowerCase();

            if (matches) {
                e.preventDefault();
                return;
            }
        }
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // Initial fullscreen
        enterFullscreen();

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [enabled, handleFullscreenChange, handleVisibilityChange, handleContextMenu, handleKeyDown, enterFullscreen]);

    const dismissWarning = useCallback(() => {
        setShowWarning(false);
        enterFullscreen();
    }, [enterFullscreen]);

    if (!enabled) {
        return children;
    }

    return (
        <div ref={containerRef} className="relative">
            {children}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div className="bg-dark-300 border border-red-500/50 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">⚠️ Warning!</h2>
                        <p className="text-gray-300 mb-4">
                            You have exited fullscreen mode. This action has been recorded.
                        </p>

                        <div className="mb-6">
                            <div className="flex justify-center gap-2 mb-2">
                                {[...Array(maxWarnings)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i < warningCount ? 'bg-red-500' : 'bg-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-gray-400">
                                Warning {warningCount} of {maxWarnings}
                            </p>
                        </div>

                        {warningCount >= maxWarnings ? (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
                                <p className="text-red-400 font-semibold">
                                    Maximum warnings exceeded. Your test may be flagged for review.
                                </p>
                            </div>
                        ) : (
                            <p className="text-amber-400 text-sm mb-4">
                                Please return to fullscreen mode to continue your assessment.
                            </p>
                        )}

                        <button
                            onClick={dismissWarning}
                            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Return to Fullscreen
                        </button>
                    </div>
                </div>
            )}

            {/* Initial Fullscreen Prompt */}
            {!isFullscreen && !showWarning && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[9999]">
                    <div className="bg-dark-300 border border-indigo-500/50 rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Fullscreen Required</h2>
                        <p className="text-gray-300 mb-6">
                            This assessment must be taken in fullscreen mode to ensure exam integrity.
                        </p>

                        <button
                            onClick={enterFullscreen}
                            className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Enter Fullscreen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FullscreenEnforcer;
