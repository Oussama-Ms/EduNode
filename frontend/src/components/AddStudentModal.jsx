import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    major: '',
    attendanceRate: 100,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendanceRate' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create student without grades for now, just to show the pipeline
      const payload = {
        ...formData,
        grades: [] // The python microservice handles empty grades safely!
      };
      
      const response = await apiClient.post('/students', payload);
      onStudentAdded(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Add New Student</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-900 text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="premium-input" placeholder="Oussama" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} className="premium-input" placeholder="M'SAAD" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="premium-input" placeholder="oussama.msaad@uit.ac.ma" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300">Major</label>
            <input required name="major" value={formData.major} onChange={handleChange} className="premium-input" placeholder="Computer Science" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300 flex justify-between">
              <span>Attendance Rate</span>
              <span className="text-brand-400">{formData.attendanceRate}%</span>
            </label>
            <input 
              type="range" 
              name="attendanceRate" 
              min="0" max="100" 
              value={formData.attendanceRate} 
              onChange={handleChange} 
              className="w-full accent-brand-500" 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center min-w-[120px]">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
