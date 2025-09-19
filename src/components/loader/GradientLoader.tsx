// GradientSpinLoader.tsx

import React from "react";

interface GradientSpinLoaderProps {
    /** Taille en pixels (largeur/hauteur du loader) */
    size?: number;
    /** Couleur de départ du dégradé (hex ou nom CSS) */
    from?: string;
    /** Couleur de fin du dégradé (hex ou nom CSS) */
    to?: string;
    /** Classes Tailwind additionnelles (position, marges...) */
    className?: string;
}

const GradientSpinLoader: React.FC<GradientSpinLoaderProps> = ({
    size = 128,
    from = "#7c3aed", // violet-600
    to = "#ec4899",   // pink-500
    className = "",
}) => {
    return (
        <svg
            className={`animate-spin ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="url(#spin-gradient)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <defs>
                <linearGradient id="spin-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                </linearGradient>
            </defs>

            {/* Tracés du Loader2 (lucide-react) */}
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
        </svg>
    );
};

export default GradientSpinLoader;
