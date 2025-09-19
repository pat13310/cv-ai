import React from 'react';
import { TrendingUp } from 'lucide-react';

export const PerformanceChart: React.FC = () => {
  const data = [
    { month: 'Jan', score: 78, cvs: 45 },
    { month: 'Fév', score: 82, cvs: 67 },
    { month: 'Mar', score: 85, cvs: 89 },
    { month: 'Avr', score: 87, cvs: 123 },
    { month: 'Mai', score: 91, cvs: 156 },
    { month: 'Jun', score: 89, cvs: 198 }
  ];

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance ATS</h3>
          <p className="text-sm text-gray-600">Score moyen et volume des CV analysés</p>
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>
      
      <div className="h-64 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-2">
            <div className="w-full flex flex-col items-center space-y-1">
              {/* Score Bar */}
              <div 
                className="w-8 bg-gradient-to-t from-violet-500 to-pink-500 rounded-t-lg transition-all duration-1000 hover:scale-110"
                style={{ height: `${(item.score / 100) * 120}px` }}
              />
              {/* CV Count Bar */}
              <div 
                className="w-4 bg-gradient-to-t from-gray-300 to-gray-400 rounded-t-sm"
                style={{ height: `${(item.cvs / 200) * 80}px` }}
              />
            </div>
            
            <div className="text-center">
              <p className="text-xs font-medium text-gray-900">{item.score}%</p>
              <p className="text-xs text-gray-500">{item.cvs} CV</p>
              <p className="text-xs text-gray-400 mt-1">{item.month}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-violet-500 to-pink-500 rounded-sm" />
          <span>Score ATS</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-400 rounded-sm" />
          <span>Nombre de CV</span>
        </div>
      </div>
    </div>
  );
};