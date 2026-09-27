import React from 'react';
import {
  Home,
  Grid3X3,
  CalendarCheck,
  Award,
  Shield,
  TrendingUp,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPreTestActive: boolean;
  userEmail?: string | null;
  userPhoto?: string | null;
  isCloudSynced: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  isPreTestActive,
}) => {
  // Exactly 6 high-priority tabs optimized for mobile
  const tabs = [
    {
      id: 'daily-goals',
      label: 'Home',
      icon: Home,
      badge: null,
    },
    {
      id: 'chapter-matrix',
      label: 'Matrix',
      icon: Grid3X3,
      badge: null,
    },
    {
      id: 'test-planner',
      label: 'Tests',
      icon: CalendarCheck,
      badge: isPreTestActive ? '1D' : null,
    },
    {
      id: 'test-scores',
      label: 'Scores',
      icon: Award,
      badge: null,
    },
    {
      id: 'study-guard',
      label: 'Guard',
      icon: Shield,
      badge: null,
    },
    {
      id: 'strategy',
      label: 'Trends',
      icon: TrendingUp,
      badge: null,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-0 inset-x-0 z-50 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 shadow-2xl safe-area-bottom"
    >
      <div className="max-w-md sm:max-w-xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-150 group ${
                  isActive
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {/* Active indicator dot on top */}
                {isActive && (
                  <span className="absolute -top-1 w-6 h-1 bg-amber-400 rounded-full shadow-sm shadow-amber-400/50" />
                )}

                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform group-active:scale-90 ${
                      isActive ? 'text-amber-400 stroke-[2.4]' : 'text-slate-400'
                    }`}
                  />

                  {/* Badge */}
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2.5 text-[9px] font-bold font-mono px-1 rounded-full bg-rose-500 text-white animate-pulse">
                      {tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[10px] mt-1 tracking-tight truncate text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
