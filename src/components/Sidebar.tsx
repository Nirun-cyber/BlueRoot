import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Droplets, 
  Calendar, 
  Activity, 
  Bell, 
  Settings, 
  Info,
  Sprout,
  User
} from 'lucide-react';

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
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.07, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

const Sidebar: React.FC = () => {
  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="show"
      className="w-64 h-screen bg-white dark:bg-[#0a0f0c] border-r border-slate-100 dark:border-white/5 flex flex-col sticky top-0 transition-colors duration-300"
    >
      {/* Logo */}
      <div className="p-6 pb-4 flex items-center gap-3 border-b border-slate-100 dark:border-white/5">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400 }}
          className="w-10 h-10 bg-[#1e9a4e] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1e9a4e]/30"
        >
          <Sprout className="text-white" size={22} />
        </motion.div>
        <div>
          <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">BlueRoot</h1>
          <p className="text-[9px] font-bold text-[#1e9a4e] uppercase tracking-widest">Smart Farm OS</p>
        </div>
      </div>

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
                  ? 'bg-[#eef9f2] dark:bg-[#1e9a4e]/15 text-[#1e9a4e] font-bold'
                  : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#1e9a4e] rounded-r-full"
                    />
                  )}
                  <item.icon size={18} className={isActive ? 'text-[#1e9a4e]' : 'text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/70 transition-colors'} />
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
          <div className="w-9 h-9 rounded-2xl bg-[#1e9a4e] flex items-center justify-center text-white font-black text-xs shadow-md shadow-[#1e9a4e]/30">
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
