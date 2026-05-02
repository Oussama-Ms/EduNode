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
  const [editingStudent, setEditingStudent] = useState(null);

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

  const handleStudentSaved = () => {
    // Refresh the list to get the latest calculated risk scores
    fetchStudents();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await apiClient.delete(`/students/${studentId}`);
        setStudents(prev => prev.filter(s => s._id !== studentId));
      } catch (error) {
        console.error("Failed to delete student", error);
        alert("Failed to delete student. See console for details.");
      }
    }
  };

  const handleExport = async () => {
    try {
      // We request blob response type so we can trigger a download
      const response = await apiClient.get('/students/export', { responseType: 'blob' });
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'text/csv' });
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to export students", error);
      alert("Failed to export students. Please try again.");
    }
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
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <span>Export CSV</span>
          </button>
          <button 
            onClick={() => {
              setEditingStudent(null);
              setIsModalOpen(true);
            }}
            className="btn-primary flex items-center gap-2 justify-center"
          >
            <Plus size={20} />
            <span>Add Student</span>
          </button>
        </div>
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

      <StudentTable 
        students={filteredStudents} 
        isLoading={loading} 
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingStudent(null);
        }} 
        onStudentAdded={handleStudentSaved}
        initialData={editingStudent}
      />
    </div>
  );
};

export default Students;
