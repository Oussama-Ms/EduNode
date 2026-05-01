import { useState, useEffect } from 'react';
import { Users, TrendingUp, AlertTriangle, Plus } from 'lucide-react';
import apiClient from '../api/client';
import StudentTable from '../components/StudentTable';
import AddStudentModal from '../components/AddStudentModal';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats state
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgAttendance, setAvgAttendance] = useState(0);
  const [highRiskStudents, setHighRiskStudents] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/students');
      const data = response.data.data || [];
      setStudents(data);
      
      // Calculate stats
      setTotalStudents(data.length);
      
      if (data.length > 0) {
        const attendanceSum = data.reduce((acc, curr) => acc + curr.attendanceRate, 0);
        setAvgAttendance(Math.round(attendanceSum / data.length));
        
        const atRisk = data.filter(s => s.riskScore > 60).length;
        setHighRiskStudents(atRisk);
      }
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
    // Force a refetch to update stats accurately
    fetchStudents();
  };

  return (
    <div className="pb-12 animate-fade-in">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor your institution's health and student performance.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>New Student</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Students" 
          value={totalStudents} 
          icon={<Users size={24} className="text-brand-600 dark:text-brand-400" />} 
          trend="+12% from last month"
          color="bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800/50"
        />
        <StatCard 
          title="Average Attendance" 
          value={`${avgAttendance}%`} 
          icon={<TrendingUp size={24} className="text-blue-600 dark:text-blue-400" />} 
          trend="Stable"
          color="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50"
        />
        <StatCard 
          title="At-Risk Students" 
          value={highRiskStudents} 
          icon={<AlertTriangle size={24} className="text-red-600 dark:text-red-400" />} 
          trend="Needs attention"
          color="bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800/50"
        />
      </div>

      {/* Main Table Area */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Recent Enrollments</h2>
      </div>

      
      <StudentTable students={students} isLoading={loading} />

      {/* Modal */}
      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStudentAdded={handleStudentAdded}
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, trend, color }) => (
  <div className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        {icon}
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
    </div>
    <div className="mt-auto">
      <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">{trend}</p>
    </div>
  </div>
);

export default Dashboard;
