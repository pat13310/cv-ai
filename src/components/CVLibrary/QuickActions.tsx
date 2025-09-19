import React from "react";
import { Sparkles, Award, FileSignature, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type QuickAction = {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    onClick?: () => void;
};

const quickActions: QuickAction[] = [
    {
        icon: Sparkles,
        title: "Créer un CV",
        description: "Avec l'assistant création",
    },
    {
        icon: Award,
        title: "Analyser un CV",
        description: "Optimisation ATS",
    },
    {
        icon: FileSignature,
        title: "Créer une lettre",
        description: "Avec l'assistant IA",
    },
    {
        icon: FileText,
        title: "Analyser une lettre",
        description: "Amélioration ciblée",
    },
];

export const QuickActions: React.FC = () => {
    return (
        <div className="bg-gradient-to-br from-violet-600 to-rose-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                {quickActions.map(({ icon: Icon, title, description,  onClick }, idx) => (
                    <button
                        key={idx}
                        onClick={onClick}
                        className={`bg-white/20 hover:bg-white/40 backdrop-blur-sm p-4 rounded-xl transition-all duration-200 border border-violet-500 hover:border-violet-200 ""}`}
                    >
                        <Icon className="w-8 h-8 mb-2" aria-hidden="true" />
                        <h4 className="font-semibold mb-1">{title}</h4>
                        <p className="text-sm text-white/80">{description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
