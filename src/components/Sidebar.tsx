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
  Menu,
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



import { useSidebar } from '../context/SidebarContext';

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const { isOpen, closeSidebar } = useSidebar();

  return (
    <>
      {/* ============ DESKTOP SIDEBAR ============ */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex h-screen bg-white dark:bg-[#0a0f0c] border-r border-slate-100 dark:border-white/5 flex-col sticky top-0 transition-colors duration-300 overflow-hidden"
          >
            {/* Logo */}
            <Link to="/" className="p-6 pb-4 flex items-center gap-3 border-b border-slate-100 dark:border-white/5 group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
                className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/10 shrink-0"
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
                <motion.div key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative whitespace-nowrap
                      ${isActive
                        ? 'bg-blue-50 dark:bg-blue-500/10 text-[#0073e6] dark:text-[#3b82f6] font-bold'
                        : 'text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'}
                    `}
                  >
                    {({ isActive }) => (
                      <>
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
            <div className="p-4 border-t border-slate-100 dark:border-white/5 whitespace-nowrap">
              <p className="px-3 text-[9px] font-black text-slate-300 dark:text-white/25 uppercase tracking-[0.18em] mb-3">Operator Node</p>
              <div className="px-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-[#0073e6] flex items-center justify-center text-white font-black text-xs shadow-md shadow-blue-500/30 shrink-0">
                  OA
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Admin User</p>
                  <p className="text-[9px] font-semibold text-slate-400 dark:text-white/30">Farmer Node • Field Manager</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ============ MOBILE DRAWER SIDEBAR ============ */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSidebar}
              className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-[70] bg-white dark:bg-[#0a0f0c] shadow-2xl flex flex-col"
            >
              {/* Logo / Header in Drawer */}
              <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-black text-xs">BR</div>
                   <h1 className="text-lg font-black tracking-tight flex items-center">
                      <span className="text-[#0073e6] dark:text-[#3b82f6]">Blue</span>
                      <span className="text-[#4caf50] dark:text-[#81c784]">Root</span>
                    </h1>
                </div>
                <button onClick={closeSidebar} className="p-2 text-slate-400">
                  <Menu size={20} />
                </button>
              </div>

              {/* Drawer Nav */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) => `
                      flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                      ${isActive ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-white/60'}
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============ MOBILE BOTTOM NAV (Optional, but kept for UX) ============ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0f0c]/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 px-2 py-3 flex items-center justify-around">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `
              flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all duration-300 relative
              ${isActive ? 'text-[#0073e6] dark:text-[#3b82f6]' : 'text-slate-400 dark:text-white/30'}
            `}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -top-1 w-12 h-1 bg-[#0073e6] rounded-full"
                  />
                )}
                <item.icon size={20} />
                <span className="text-[10px] font-bold">{item.label.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
