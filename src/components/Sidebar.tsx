import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Droplets, 
  Calendar, 
  Activity, 
  Bell, 
  Settings, 
  Info,
} from 'lucide-react';
import logoLight from '../assets/logo-full.png';
import logoDark from '../assets/logo-dark.png';

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/irrigation',   icon: Droplets,        label: 'Irrigation' },
  { to: '/fertigation',  icon: Calendar,        label: 'Fertigation' },
  { to: '/water-quality',icon: Activity,        label: 'Water Quality' },
  { to: '/alerts',       icon: Bell,            label: 'Alerts & Logs' },
  { to: '/settings',     icon: Settings,        label: 'Settings' },
  { to: '/about',        icon: Info,            label: 'About' },
];

const sidebarVariants = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.07, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
      className="w-64 h-screen bg-white dark:bg-[#0a0f0c] border-r border-slate-100 dark:border-white/5 flex flex-col sticky top-0 transition-colors duration-300"
    >
      {/* Logo */}
      <Link to="/" className="p-6 pb-4 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
        <motion.div
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={theme}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.5 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              src={theme === 'dark' ? logoDark : logoLight}
              alt="BlueRoot Logo"
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
        </motion.div>
        <div>
          <h1 className="text-lg font-black tracking-tight flex items-center">
            <span className="text-[#0073e6] dark:text-[#3b82f6]">Blue</span>
            <span className="text-[#4caf50] dark:text-[#81c784]">Root</span>
          </h1>
          <p className="text-[9px] font-bold text-slate-400 dark:text-white/30 uppercase tracking-widest">Smart Farm OS</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-4 text-[9px] font-black text-slate-300 dark:text-white/25 uppercase tracking-[0.18em] mb-3">
          Intelligence Menu
        </p>

        {navItems.map((item) => (
          <motion.div key={item.to} variants={itemVariants}>
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative
                ${isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-[#0073e6] dark:text-[#3b82f6] font-bold'
                  : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0073e6] rounded-r-full"
                    />
                  )}
                  <item.icon size={18} className={isActive ? 'text-[#0073e6]' : 'text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/70 transition-colors'} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Bottom operator */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5">
        <p className="px-3 text-[9px] font-black text-slate-300 dark:text-white/25 uppercase tracking-[0.18em] mb-3">Operator Node</p>
        <div className="px-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#0073e6] flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/30">
            OA
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white">Admin User</p>
            <p className="text-[9px] font-semibold text-slate-400 dark:text-white/30">Farmer Node • Field Manager</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
