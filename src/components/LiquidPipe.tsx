import React from 'react';
import { motion } from 'framer-motion';

interface LiquidPipeProps {
  type: 'irrigation' | 'fertigation';
  isActive: boolean;
}

const LiquidPipe: React.FC<LiquidPipeProps> = ({ type, isActive }) => {
  if (!isActive) return null;

  const isWater = type === 'irrigation';
  
  // Premium Enterprise Gradients & Shadows
  const theme = isWater 
    ? {
        bgGradient: 'linear-gradient(90deg, #0369a1, #0ea5e9)',
        glow: 'rgba(14, 165, 233, 0.4)',
      }
    : {
        bgGradient: 'linear-gradient(90deg, #047857, #10b981)',
        glow: 'rgba(16, 185, 129, 0.4)',
      };

  // Minimalist light streaks (fiber-optic flow effect)
  const streaks = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    width: Math.random() * 40 + 20, // 20px to 60px wide
    top: Math.random() * 60 + 20, // 20% to 80% height
    duration: Math.random() * 1.5 + 1.5, // 1.5s to 3.0s
    delay: Math.random() * 2,
  }));

  return (
    <div className="w-full relative py-1">
      {/* Outer Container with Premium Glass Effect */}
      <div 
        className="relative w-full h-6 rounded-full overflow-hidden bg-slate-900 dark:bg-black/80 border border-slate-200/20 dark:border-white/10"
        style={{ boxShadow: `0 4px 20px ${theme.glow}` }}
      >
        
        {/* Base Liquid Color */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{ background: theme.bgGradient }}
        ></div>

        {/* Elegant Primary Wave (Smooth Sine) */}
        <motion.div 
          className="absolute top-0 bottom-0 left-0 w-[200%] mix-blend-overlay opacity-30"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: "linear", duration: 4, repeat: Infinity }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'%3E%3Cpath d='M0,50 C250,30 250,70 500,50 C750,30 750,70 1000,50 L1000,100 L0,100 Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '50% 100%',
          }}
        ></motion.div>

        {/* Elegant Secondary Wave (Offset, Slower) */}
        <motion.div 
          className="absolute top-1 bottom-0 left-0 w-[200%] mix-blend-overlay opacity-20"
          animate={{ x: ['-50%', '0%'] }}
          transition={{ ease: "linear", duration: 6, repeat: Infinity }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 100' preserveAspectRatio='none'%3E%3Cpath d='M0,50 C250,75 250,25 500,50 C750,75 750,25 1000,50 L1000,100 L0,100 Z' fill='white'/%3E%3C/svg%3E")`,
            backgroundSize: '50% 100%',
          }}
        ></motion.div>

        {/* Fiber-Optic Light Streaks (Professional flow representation) */}
        <div className="absolute inset-0 overflow-hidden mix-blend-overlay">
          {streaks.map((s) => (
            <motion.div
              key={s.id}
              className="absolute h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,1)]"
              style={{ top: `${s.top}%`, width: `${s.width}px` }}
              initial={{ left: '-20%', opacity: 0 }}
              animate={{ left: '120%', opacity: [0, 1, 1, 0] }}
              transition={{
                duration: s.duration,
                repeat: Infinity,
                delay: s.delay,
                ease: "linear"
              }}
            />
          ))}
        </div>
        
        {/* Ultra-Realistic Glass Highlights & Inner Shadows */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.4),inset_0_-1px_3px_rgba(255,255,255,0.15)] pointer-events-none"></div>
        
        {/* Soft Top Reflection */}
        <div className="absolute top-0 left-2 right-2 h-[30%] bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none blur-[1px]"></div>
      </div>
    </div>
  );
};

export default LiquidPipe;
