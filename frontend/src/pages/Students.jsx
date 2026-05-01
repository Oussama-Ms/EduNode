import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import StudentTable from '../components/StudentTable';
import AddStudentModal from '../components/AddStudentModal';
import { Plus, Search, Filter } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch students", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Student Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage all enrolled students across the institution.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-4 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or major..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="premium-input pl-10"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-medium">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      <StudentTable students={filteredStudents} isLoading={loading} />

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

export default Students;
