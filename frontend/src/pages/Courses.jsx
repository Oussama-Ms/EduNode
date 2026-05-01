import { BookOpen, Code, Database, Globe, Network, BrainCircuit } from 'lucide-react';

const predefinedCourses = [
  { id: 'CS101', title: 'Intro to Programming', description: 'Foundations of computer science and basic algorithms.', icon: Code, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'CS201', title: 'Data Structures', description: 'Advanced data organization and manipulation techniques.', icon: Network, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  { id: 'CS301', title: 'Web Development', description: 'Building modern, responsive web applications.', icon: Globe, color: 'text-brand-500', bg: 'bg-brand-100 dark:bg-brand-900/30' },
  { id: 'CS401', title: 'Database Systems', description: 'Relational database design and SQL querying.', icon: Database, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'CS501', title: 'Machine Learning', description: 'Predictive modeling and neural networks.', icon: BrainCircuit, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
];

const Courses = () => {
  return (
    <div className="pb-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen size={32} className="text-brand-600 dark:text-brand-400" />
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Curriculum Offerings</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage core courses available for enrollment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {predefinedCourses.map((course) => {
          const IconComponent = course.icon;
          return (
            <div key={course.id} className="glass-card p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300 border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${course.bg}`}>
                  <IconComponent size={24} className={course.color} />
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full border border-slate-200 dark:border-slate-700">
                  {course.id}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{course.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
