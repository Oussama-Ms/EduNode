import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

const Register = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/auth/register', { name, email, password });
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminName', data.data.name);
      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative overflow-hidden max-w-[100vw] overflow-x-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-400 dark:bg-brand-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-30 dark:opacity-20 animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[128px] opacity-30 dark:opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-8 relative z-10 animate-fade-in text-slate-900 dark:text-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">EduNode</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">Create Account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="premium-input pl-10" 
                placeholder="Admin Name" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="premium-input pl-10" 
                placeholder="admin@edunode.com" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="password" 
                required 
                minLength="6"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="premium-input pl-10" 
                placeholder="At least 6 characters" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Register <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account? <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
