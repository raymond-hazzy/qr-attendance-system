
// src/pages/AttendanceList.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceApi } from "../pages/api";
import { departments } from "./data";
import type { AttendanceRecord, SummaryData } from "../pages/api";
import { Download } from "lucide-react";

interface CourseOption {
  code: string;
  name: string;
  department: string;
}

const AttendanceList = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [summaryData, setSummaryData] = useState<SummaryData>({
    registeredCount: 0,
    todayScans: 0,
    courseName: "All Courses"
  });
  const navigate = useNavigate();

  
  const getAllCourses = (): CourseOption[] => {
    const allCourses: CourseOption[] = [];
    
    departments.forEach(dept => {
      dept.courses.forEach(course => {
        
        if (!allCourses.find(c => c.code === course.code)) {
          allCourses.push({
            code: course.code,
            name: course.name,
            department: dept.name
          });
        }
      });
    });
    
    return allCourses.sort((a, b) => a.code.localeCompare(b.code));
  };

  const courses = getAllCourses();

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedCourse]);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const [records, summary] = await Promise.all([
        attendanceApi.getAttendanceList(selectedCourse),
        attendanceApi.getAttendanceSummary(selectedCourse)
      ]);
      
      setAttendanceRecords(records);
      setSummaryData(summary);
      
    } catch (err: any) {
      setError(err.message || "Failed to fetch attendance records");
      setAttendanceRecords([]);
      setSummaryData({
        registeredCount: 0,
        todayScans: 0,
        courseName: selectedCourse === "all" ? "All Courses" : selectedCourse
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCourseDisplayName = (courseCode: string) => {
    if (courseCode === "all") return "All Courses";
    const course = courses.find(c => c.code === courseCode);
    return course ? `${course.code} - ${course.name}` : courseCode;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-light-grey-100)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-navy-blue-500)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-light-grey-100)] p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-navy-blue-800)]">
            📊 Attendance Records
          </h1>
          <button
            onClick={() => navigate("/lecturer-scanner")}
            className="bg-[var(--color-golden-yellow-300)] hover:bg-[var(--color-golden-yellow-700)] text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
          >
             Back to Scanner
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-[var(--color-light-grey-200)]">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="font-semibold text-[var(--color-navy-blue-700)]">
              Filter by Course:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="border border-[var(--color-light-grey-300)] rounded-lg px-3 py-2 text-[var(--color-navy-blue-800)] focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)] min-w-[250px]"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course.code} value={course.code}>
                  {course.code} - {course.name} ({course.department})
                </option>
              ))}
            </select>
            <button
              onClick={fetchAttendanceRecords}
              className="bg-[var(--color-navy-blue-600)] hover:bg-[var(--color-navy-blue-700)] text-white font-semibold py-2 px-4 rounded-lg transition-colors shadow-md"
            >
              🔄 Refresh
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-sm text-[var(--color-navy-blue-700)] font-medium">Quick filters:</span>
            <button
              onClick={() => setSelectedCourse("all")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedCourse === "all"
                  ? "bg-[var(--color-navy-blue-600)] text-white"
                  : "bg-[var(--color-light-grey-200)] text-[var(--color-navy-blue-800)] hover:bg-[var(--color-light-grey-300)]"
              }`}
            >
              All Courses
            </button>
            {courses.slice(0, 4).map((course) => (
              <button
                key={course.code}
                onClick={() => setSelectedCourse(course.code)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  selectedCourse === course.code
                    ? "bg-[var(--color-navy-blue-600)] text-white"
                    : "bg-[var(--color-light-grey-200)] text-[var(--color-navy-blue-800)] hover:bg-[var(--color-light-grey-300)]"
                }`}
              >
                {course.code}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 border border-red-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-[var(--color-light-grey-200)]">
          <h3 className="font-semibold text-lg mb-4 text-[var(--color-navy-blue-800)]">
            📈 Summary - {getCourseDisplayName(selectedCourse)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-navy-blue-50)] p-4 rounded-lg border border-[var(--color-navy-blue-100)]">
              <div className="text-2xl font-bold text-[var(--color-navy-blue-600)]">
                {summaryData.registeredCount}
              </div>
              <div className="text-[var(--color-navy-blue-800)]">Registered Students</div>
              <div className="text-xs text-[var(--color-light-grey-600)] mt-1">
                Students enrolled in this course
              </div>
            </div>
            <div className="bg-[var(--color-golden-yellow-50)] p-4 rounded-lg border border-[var(--color-golden-yellow-100)]">
              <div className="text-2xl font-bold text-[var(--color-golden-yellow-600)]">
                {summaryData.todayScans}
              </div>
              <div className="text-[var(--color-golden-yellow-800)]">Scans Today</div>
              <div className="text-xs text-[var(--color-light-grey-600)] mt-1">
                Attendance marked today
              </div>
            </div>
            <div className="bg-[var(--color-navy-blue-50)] p-4 rounded-lg border border-[var(--color-navy-blue-100)]">
              <div className="text-2xl font-bold text-[var(--color-navy-blue-600)]">
                {attendanceRecords.length}
              </div>
              <div className="text-[var(--color-navy-blue-800)]">Total Records</div>
              <div className="text-xs text-[var(--color-light-grey-600)] mt-1">
                All attendance records
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[var(--color-light-grey-200)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-light-grey-50)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-light-grey-600)] uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-light-grey-600)] uppercase tracking-wider">
                    Matric No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-light-grey-600)] uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-light-grey-600)] uppercase tracking-wider">
                    Last Scan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-light-grey-600)] uppercase tracking-wider">
                    Total Scans
                  </th>
                  <button>
                    <Download  size={30} className="text-[var(--color-light-grey-600)]"/ >
                  </button>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-light-grey-200)]">
                {attendanceRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-[var(--color-light-grey-50)]">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {/* {record.profileImage ? (
                          <img
                            src={record.profileImage}
                            alt={record.fullName}
                            className="h-10 w-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[var(--color-light-grey-200)] flex items-center justify-center mr-3">
                            <span className="text-lg">👤</span>
                          </div>
                        )} */}
                        <div>
                          <div className="font-medium text-[var(--color-navy-blue-900)]">
                            {record.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-navy-blue-900)]">
                      {record.matricNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-navy-blue-900)]">
                      <span className="bg-[var(--color-navy-blue-100)] text-[var(--color-navy-blue-800)] text-xs font-medium px-2 py-1 rounded-full">
                        {record.courseCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[var(--color-navy-blue-900)]">
                      {new Date(record.lastScanned).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-[var(--color-navy-blue-100)] text-[var(--color-navy-blue-800)] text-sm font-medium px-2 py-1 rounded-full">
                        {record.scanCount} times
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {attendanceRecords.length === 0 && !isLoading && (
            <div className="text-center py-12 text-[var(--color-light-grey-600)]">
              {selectedCourse === "all" 
                ? "No attendance records found for any course."
                : `No attendance records found for ${getCourseDisplayName(selectedCourse)}.`
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;