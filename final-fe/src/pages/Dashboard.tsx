// ./src/pages/Dashboard.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { departments, quotes } from "./data.ts";
import { attendanceApi } from "./api";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [displayQuotes, setDisplayQuotes] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      const userDept = departments.find(dept => dept.name === parsedData.department);
      if (userDept) {
        setUserCourses(userDept.courses);
      }
    }
    
    const shuffled = [...quotes].sort(() => Math.random() - 0.5);
    setDisplayQuotes(shuffled.slice(0, 2));

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAttendance = async () => {
    if (!selectedCourse) {
      alert("Please select a course first");
      return;
    }
    
    setIsGeneratingQR(true);
    try {
      const response = await attendanceApi.generateQRCode(selectedCourse);
      
      // Navigate to QR code page with the generated QR code
      navigate("/qr-attendance", { 
        state: { 
          courseCode: selectedCourse,
          qrCode: response.qrCode,
          expiresIn: response.expiresIn
        } 
      });
    } catch (error: any) {
      alert("Failed to generate QR code: " + error.message);
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.history.replaceState(null, '', '/login');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-grey-50)] to-[var(--color-light-grey-100)] py-8 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 mt-10 mx-auto text-center border border-[var(--color-light-grey-200)]">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[var(--color-navy-blue-700)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-navy-blue-800)] mb-2">
            Student Dashboard
          </h1>
          <p className="text-[var(--color-light-grey-600)]">Welcome to your learning portal</p>
        </div>

        <div className="mb-6" ref={dropdownRef}>
          <label className="block text-lg font-semibold text-[var(--color-navy-blue-700)] mb-3">
            Choose Course
          </label>
          
          <div className="relative">
            <div 
              className="w-full rounded-xl border border-[var(--color-light-grey-300)] px-4 py-3 text-lg bg-white cursor-pointer flex justify-between items-center hover:border-[var(--color-navy-blue-300)] transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className={selectedCourse ? "text-[var(--color-navy-blue-800)] font-medium" : "text-[var(--color-light-grey-500)]"}>
                {selectedCourse || "-- Select a Course --"}
              </span>
              <svg 
                className={`w-5 h-5 transition-transform ${dropdownOpen ? "rotate-180" : ""} text-[var(--color-navy-blue-600)]`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-[var(--color-light-grey-300)] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {userCourses.map((course) => (
                  <div
                    key={course.id}
                    className="px-4 py-3 hover:bg-[var(--color-navy-blue-50)] cursor-pointer text-left border-b border-[var(--color-light-grey-100)] last:border-b-0 transition-colors"
                    onClick={() => {
                      setSelectedCourse(course.code);
                      setDropdownOpen(false);
                    }}
                  >
                    <div className="font-medium text-[var(--color-navy-blue-800)]">{course.code}</div>
                    <div className="text-sm text-[var(--color-light-grey-600)]">{course.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <button 
            className="w-full py-4 text-xl font-bold bg-[var(--color-navy-blue-600)] text-white rounded-2xl hover:bg-[var(--color-navy-blue-700)] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            onClick={handleMarkAttendance}
            disabled={!selectedCourse || isGeneratingQR}
          >
            {isGeneratingQR ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Generating QR Code...
              </>
            ) : (
              "Mark Attendance"
            )}
          </button>

          {selectedCourse && (
            <p className="mt-4 text-[var(--color-navy-blue-700)] text-lg">
              ✅ Selected Course:{" "}
              <span className="font-semibold text-[var(--color-navy-blue-800)]">{selectedCourse}</span>
            </p>
          )}
        </div>

        <div className="bg-[var(--color-golden-yellow-50)] p-6 rounded-2xl mb-8 border border-[var(--color-golden-yellow-200)]">
          <h2 className="text-3xl font-extrabold text-[var(--color-navy-blue-800)] mb-4">
            GO TO CLASS TODAY!!!
          </h2>
          
          <div className="mt-4 space-y-4">
            {displayQuotes.map((quote, idx) => (
              <p key={idx} className="text-xl font-semibold text-[var(--color-navy-blue-700)] italic">
                "{quote}"
              </p>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto py-3 px-4 text-lg font-bold bg-[var(--color-navy-blue-600)] text-white rounded-2xl hover:bg-[var(--color-navy-blue-700)] transition-colors shadow-md">
          <button
            onClick={handleLogOut}
            className="w-full flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;