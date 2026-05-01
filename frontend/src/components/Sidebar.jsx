import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  return (
    <aside className="w-64 glass-card m-4 hidden md:flex flex-col relative z-20 overflow-hidden border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">
          EduNode
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium tracking-wider uppercase">Enterprise Edition</p>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavItem to="/students" icon={<Users size={20} />} label="Students" />
        <NavItem to="/courses" icon={<BookOpen size={20} />} label="Courses" />
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex-1">
          <NavItem to="/settings" icon={<Settings size={20} />} label="Settings" />
        </div>
        <div className="ml-2">
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium w-full ${
          isActive
            ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

export default Sidebar;
