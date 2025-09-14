// ./src/pages/LecturerScanner.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { attendanceApi } from "./api";
import { Html5QrcodeScanner } from "html5-qrcode";

interface AttendanceRecord {
  id: string;
  studentId: string;
  matricNo: string;
  fullName: string;
  courseCode: string;
  timestamp: string;
  scanCount: number;
}

const LecturerScanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [lastScannedStudent, setLastScannedStudent] =
    useState<AttendanceRecord | null>(null);

  const scannerRef = useRef<any>(null);
  const [scannerReady, setScannerReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!scannerRef.current) {
      initializeScanner();
    }

    return () => cleanupScanner();
  }, []);

  const initializeScanner = () => {
    try {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        false
      );

      scannerRef.current.render(
        (decodedText: string) => handleSuccessfulScan(decodedText),
        (errorMessage: string) => console.log("Scan error:", errorMessage)
      );

      setScannerReady(true);
    } catch (error) {
      console.error("Scanner initialization error:", error);
      setError("Failed to initialize scanner. Please refresh the page.");
    }
  };

  const cleanupScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .clear()
        .catch((e: any) => console.log("Cleanup error:", e));
      scannerRef.current = null;
      setScannerReady(false);
    }
  };

  const handleSuccessfulScan = async (encryptedData: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await attendanceApi.markAttendance(encryptedData);

      setLastScannedStudent({
        id: response.attendance.id,
        studentId: response.attendance.studentId,
        matricNo: response.attendance.matricNo,
        fullName: response.attendance.fullName,
        courseCode: response.attendance.courseCode,
        timestamp: response.attendance.lastScanned,
        scanCount: response.attendance.scanCount,
      });

      setSuccessMessage(
        `Attendance marked for ${response.attendance.fullName}!`
      );

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err.message || "Invalid QR code format");
      console.error("Scan error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const viewAttendanceList = () => {
    navigate("/attendance-list");
  };

  return (
    <div className="min-h-screen bg-[var(--color-light-grey-100)] p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[var(--color-navy-blue-800)] mb-8">
          📱 Lecturer QR Scanner
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-[var(--color-light-grey-200)]">
          <h2 className="text-xl font-semibold mb-4 text-[var(--color-navy-blue-700)]">
            Scan Student QR Code
          </h2>

          <div className="relative mb-4 min-h-[300px]">
            <div id="qr-reader" className="rounded-lg overflow-hidden"></div>

            <div className="absolute inset-0 border-4 border-[var(--color-navy-blue-400)] border-dashed rounded-lg pointer-events-none"></div>

            {isLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <span className="ml-3 text-white">Processing...</span>
              </div>
            )}

            {!scannerReady && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p>Initializing scanner...</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 border border-red-200">
              ❌ {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 border border-green-200">
              ✅ {successMessage}
            </div>
          )}

          {lastScannedStudent && (
            <div className="bg-[var(--color-navy-blue-50)] p-4 rounded-lg mt-4 border border-[var(--color-navy-blue-100)]">
              <h3 className="font-semibold text-[var(--color-navy-blue-800)] mb-2">
                Last Scanned Student:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium">Name:</span>{" "}
                  {lastScannedStudent.fullName}
                </div>
                <div>
                  <span className="font-medium">Matric No:</span>{" "}
                  {lastScannedStudent.matricNo}
                </div>
                <div>
                  <span className="font-medium">Course:</span>{" "}
                  {lastScannedStudent.courseCode}
                </div>
                <div>
                  <span className="font-medium">Total Scans:</span>
                  <span className="bg-[var(--color-navy-blue-200)] text-[var(--color-navy-blue-800)] px-2 py-1 rounded-full ml-2">
                    {lastScannedStudent.scanCount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={viewAttendanceList}
            className="bg-[var(--color-navy-blue-600)] hover:bg-[var(--color-navy-blue-700)] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            📋 View Attendance List
          </button>

          <button
            onClick={() => navigate("/lecturer-dashboard")}
            className="bg-[var(--color-light-grey-600)] hover:bg-[var(--color-light-grey-700)] text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default LecturerScanner;
