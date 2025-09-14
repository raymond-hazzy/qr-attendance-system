//src/pages/LecturerDashboard.tsx

import { useNavigate } from 'react-router-dom';

const LecturerDashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-[var(--color-light-grey-50)] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[var(--color-navy-blue-700)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">👨‍🏫</span>
          </div>
          <h1 className="text-3xl font-bold text-[var(--color-navy-blue-800)] mb-2">
            Lecturer Dashboard
          </h1>
          <p className="text-[var(--color-light-grey-600)]">Manage student attendance and courses</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => navigate('/lecturer-scanner')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[var(--color-navy-blue-200)] group"
          >
            <div className="w-12 h-12 bg-[var(--color-navy-blue-100)] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-navy-blue-200)] transition-colors">
              <span className="text-2xl text-[var(--color-navy-blue-700)]">📱</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-navy-blue-800)] mb-3">QR Scanner</h2>
            <p className="text-[var(--color-light-grey-600)]">Scan student QR codes to mark attendance</p>
            <div className="mt-4 text-[var(--color-golden-yellow-600)] font-medium flex items-center">
              Start scanning 
              <span className="ml-2">→</span>
            </div>
          </div>
          
          <div 
            onClick={() => navigate('/attendance-list')}
            className="bg-white p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[var(--color-navy-blue-200)] group"
          >
            <div className="w-12 h-12 bg-[var(--color-navy-blue-100)] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[var(--color-navy-blue-200)] transition-colors">
              <span className="text-2xl text-[var(--color-navy-blue-700)]">📊</span>
            </div>
            <h2 className="text-xl font-semibold text-[var(--color-navy-blue-800)] mb-3">Attendance List</h2>
            <p className="text-[var(--color-light-grey-600)]">View all attendance records and statistics</p>
            <div className="mt-4 text-[var(--color-golden-yellow-600)] font-medium flex items-center">
              View records 
              <span className="ml-2">→</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[var(--color-light-grey-200)]">
          <h2 className="text-xl font-semibold text-[var(--color-navy-blue-800)] mb-6">Today's Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[var(--color-navy-blue-50)] p-4 rounded-lg text-center border border-[var(--color-navy-blue-100)]">
              <div className="text-2xl font-bold text-[var(--color-navy-blue-700)]">24</div>
              <div className="text-[var(--color-navy-blue-600)] text-sm">Today's Scans</div>
            </div>
            <div className="bg-[var(--color-golden-yellow-50)] p-4 rounded-lg text-center border border-[var(--color-golden-yellow-100)]">
              <div className="text-2xl font-bold text-[var(--color-golden-yellow-700)]">156</div>
              <div className="text-[var(--color-golden-yellow-600)] text-sm">Total Students</div>
            </div>
            <div className="bg-[var(--color-navy-blue-50)] p-4 rounded-lg text-center border border-[var(--color-navy-blue-100)]">
              <div className="text-2xl font-bold text-[var(--color-navy-blue-700)]">7</div>
              <div className="text-[var(--color-navy-blue-600)] text-sm">Active Courses</div>
            </div>
            <div className="bg-[var(--color-golden-yellow-50)] p-4 rounded-lg text-center border border-[var(--color-golden-yellow-100)]">
              <div className="text-2xl font-bold text-[var(--color-golden-yellow-700)]">92%</div>
              <div className="text-[var(--color-golden-yellow-600)] text-sm">Attendance Rate</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-[var(--color-navy-blue-600)] hover:bg-[var(--color-navy-blue-700)] text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturerDashboard;
