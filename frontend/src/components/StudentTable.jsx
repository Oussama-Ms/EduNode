import { AlertCircle, CheckCircle2 } from 'lucide-react';

const StudentTable = ({ students, isLoading }) => {
  if (isLoading) {
    return (
      <div className="glass-card p-8 flex justify-center items-center h-64 mt-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="glass-card p-8 text-center mt-6 bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No students found. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden mt-6 animate-slide-up bg-white/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Major</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900 dark:to-brand-800 flex items-center justify-center text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700 font-bold">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-200">{student.firstName} {student.lastName}</div>
                      <div className="text-sm text-slate-500">{student.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50">
                    {student.major}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                  {student.attendanceRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskBadge score={student.riskScore} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-component to beautifully render the risk score
const RiskBadge = ({ score }) => {
  if (score === null || score === undefined) return <span className="text-slate-400 dark:text-slate-500 text-sm">Pending</span>;

  let colorClass = 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50';
  let Icon = CheckCircle2;

  if (score > 60) {
    colorClass = 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50';
    Icon = AlertCircle;
  } else if (score > 30) {
    colorClass = 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50';
    Icon = AlertCircle; // Or a warning icon
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${colorClass}`}>
      <Icon size={14} />
      <span className="text-xs font-bold">{score}%</span>
    </div>
  );
};

export default StudentTable;
