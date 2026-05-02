import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/client';

const predefinedCourses = [
  { id: 'CS101', title: 'Intro to Programming' },
  { id: 'CS201', title: 'Data Structures' },
  { id: 'CS301', title: 'Web Development' },
  { id: 'CS401', title: 'Database Systems' },
  { id: 'CS501', title: 'Machine Learning' },
];

const AddStudentModal = ({ isOpen, onClose, onStudentAdded, initialData = null }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    major: 'Computer Science',
    attendanceRate: 100,
    grades: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [newGrade, setNewGrade] = useState({ courseCode: 'CS101', score: 15 });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, grades: initialData.grades || [] });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          major: 'Computer Science',
          attendanceRate: 100,
          grades: []
        });
      }
      setNewGrade({ courseCode: 'CS101', score: 15 });
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'attendanceRate' ? Number(value) : value
    }));
  };

  const handleAddGrade = () => {
    if (newGrade.score < 0 || newGrade.score > 20) return;
    setFormData(prev => {
      // Check if course already exists, replace it if so
      const existing = prev.grades.findIndex(g => g.courseCode === newGrade.courseCode);
      let updatedGrades = [...prev.grades];
      if (existing >= 0) {
        updatedGrades[existing] = newGrade;
      } else {
        updatedGrades.push(newGrade);
      }
      return { ...prev, grades: updatedGrades };
    });
  };

  const handleRemoveGrade = (courseCode) => {
    setFormData(prev => ({
      ...prev,
      grades: prev.grades.filter(g => g.courseCode !== courseCode)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      
      let response;
      if (initialData && initialData._id) {
        // Update existing student
        response = await apiClient.put(`/students/${initialData._id}`, payload);
      } else {
        // Create new student
        response = await apiClient.post('/students', payload);
      }
      
      onStudentAdded(response.data.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {initialData ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm rounded-xl">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} className="premium-input" placeholder="Oussama" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} className="premium-input" placeholder="M'SAAD" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} className="premium-input" placeholder="oussama.msaad@uit.ac.ma" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Major</label>
            <input readOnly name="major" value={formData.major} className="premium-input bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed opacity-70" />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between">
              <span>Attendance Rate</span>
              <span className="text-brand-600 dark:text-brand-400">{formData.attendanceRate}%</span>
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

          {/* Grades Section */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Grades</label>
            
            {formData.grades.length > 0 && (
              <div className="mb-3 space-y-2">
                {formData.grades.map(grade => (
                  <div key={grade.courseCode} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{grade.courseCode}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{grade.score}/20</span>
                      <button type="button" onClick={() => handleRemoveGrade(grade.courseCode)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <select 
                  value={newGrade.courseCode}
                  onChange={(e) => setNewGrade({...newGrade, courseCode: e.target.value})}
                  className="premium-input py-2 text-sm"
                >
                  {predefinedCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.id} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div className="w-20 space-y-1">
                  <input 
                    type="number" 
                    min="0" max="20" 
                    value={newGrade.score}
                    onChange={(e) => setNewGrade({...newGrade, score: Number(e.target.value)})}
                    className="premium-input py-2 text-sm"
                    placeholder="Score"
                  />
              </div>
              <button 
                type="button" 
                onClick={handleAddGrade}
                className="btn-primary py-2 px-4 text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-4">
            <button type="button" onClick={onClose} className="px-6 py-3 font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center min-w-[120px]">
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                initialData ? 'Update Student' : 'Save Student'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
