import { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Admin');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/login');
  };

  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon size={32} className="text-brand-600 dark:text-brand-400" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">System Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your EduNode instance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="col-span-1 space-y-2">
          <SettingsTab active icon={<Shield size={18} />} label="Account Settings" />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" />
          <SettingsTab icon={<Key size={18} />} label="API Keys" />
        </div>

        {/* Settings Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="glass-card p-6 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">Admin Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Display Name</label>
                <input 
                  type="text" 
                  value={adminName} 
                  onChange={(e) => setAdminName(e.target.value)}
                  className="premium-input mt-1" 
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button className="btn-primary py-2 px-6">Save Changes</button>
            </div>
          </div>

          <div className="glass-card p-6 border-red-200 dark:border-red-900/30 bg-white/70 dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Log out of your administrative session securely.</p>
            <button onClick={handleLogout} className="px-6 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/50 rounded-xl transition-colors font-medium">
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingsTab = ({ active, icon, label }) => (
  <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
    active 
      ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/50' 
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
  }`}>
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default Settings;
