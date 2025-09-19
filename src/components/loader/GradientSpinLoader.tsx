import React from "react";

interface GradientSpinLoaderProps {
    size?: number;
    thickness?: number;
    className?: string;
}

const GradientSpinLoader: React.FC<GradientSpinLoaderProps> = ({
    size = 128,
    thickness = 0.1,
    className = "",
}) => {
    return (
        <div 
            className={`animate-spin ${className}`}
            style={{ 
                width: size, 
                height: size,
                background: `conic-gradient(from 0deg, #7c3aed 0deg, #ec4899 90deg, #7c3aed 180deg, #ec4899 270deg, #7c3aed 360deg)`,
                borderRadius: '50%',
                mask: `radial-gradient(circle at center, transparent ${size * (0.5 - thickness)}px, black ${size * (0.5 - thickness + 0.05)}px)`,
                WebkitMask: `radial-gradient(circle at center, transparent ${size * (0.5 - thickness)}px, black ${size * (0.5 - thickness + 0.05)}px)`,
                position: 'relative'
            }}
        />
    );
};

export default GradientSpinLoader;