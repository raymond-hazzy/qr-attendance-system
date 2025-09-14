//src/pages/QRCodePage.tsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QRCodePage = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  
  const courseCode = location.state?.courseCode || "Unknown Course";
  const qrCodeData = location.state?.qrCode || null;

  useEffect(() => {
    const loadUserData = () => {
      try {
        setIsLoading(true);
        setError("");
        
        const storedData = localStorage.getItem('userData');
        console.log('localStorage data:', storedData);
        
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('Parsed user data:', parsedData);
          setUserData(parsedData);
          
          if (parsedData.profileImage) {
            const imagePath = parsedData.profileImage;
            const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
            const fullImageUrl = `http://localhost:5000/${cleanPath}`;
            
            console.log('Constructed image URL:', fullImageUrl);
            setProfileImageUrl(fullImageUrl);
            
            testImageLoad(fullImageUrl);
          } else {
            console.log('No profileImage found in user data');
            setError('No profile image found for this user');
          }
        } else {
          setError("No user data found. Please log in again.");
        }
      } catch (err: any) {
        setError("Error loading user data: " + err.message);
        console.error('Error loading user data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  console.log(error)

  const testImageLoad = (url: string) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image loaded successfully:', url);
    };
    img.onerror = () => {
      console.error('❌ Failed to load image:', url);
      setError(`Profile image not found. Please check if the file exists at: ${url}`);
    };
    img.src = url;
  };

  useEffect(() => {
    if (qrCodeData) {
      setQrCode(qrCodeData);
    } else {
      navigate("/dashboard");
    }
  }, [qrCodeData, navigate]);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const refreshPage = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-grey-50)] to-[var(--color-light-grey-100)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-navy-blue-500)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-light-grey-50)] to-[var(--color-light-grey-100)] py-4 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-4 md:p-8 text-center border border-[var(--color-light-grey-200)] mx-2">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-navy-blue-600)] mb-2">
          Scan QR Code for Attendance
        </h1>
        
        <p className="text-[var(--color-light-grey-600)] mb-6 text-sm md:text-base">
          Please show this QR code to your lecturer to mark attendance for {courseCode}
        </p>

        {/* {error && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-4 border border-yellow-200">
            {error}
          </div>
        )} */}
      

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
          <div className="flex-1 w-full">
            {qrCode ? (
              <div className="bg-white p-2 md:p-4 rounded-xl shadow-lg inline-block border border-[var(--color-light-grey-200)] max-w-full">
                <img 
                  src={qrCode} 
                  alt="Attendance QR Code" 
                  className="w-48 h-48 md:w-64 md:h-64 mx-auto"
                />
              </div>
            ) : null}
          </div>

          <div className="flex-1 w-full">
            <h3 className="text-lg md:text-xl font-semibold text-[var(--color-navy-blue-800)] mb-4">Student Information</h3>
            
            <div className="mb-4 md:mb-6 flex justify-center">
              {profileImageUrl ? (
                <div className="relative">
                  <img 
                    src={profileImageUrl} 
                    alt="Student" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-[var(--color-navy-blue-200)] shadow-md"
                    onError={(e) => {
                      console.error('Failed to load image in img tag:', profileImageUrl);
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-light-grey-200)] items-center justify-center border-4 border-[var(--color-navy-blue-200)]">
                    <span className="text-[var(--color-light-grey-500)] text-2xl md:text-4xl">👤</span>
                  </div>
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                    <span className="bg-[var(--color-navy-blue-500)] text-white text-xs font-bold px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[var(--color-light-grey-200)] flex items-center justify-center border-4 border-[var(--color-navy-blue-200)] relative">
                  <span className="text-[var(--color-light-grey-500)] text-2xl md:text-4xl">👤</span>
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                    <span className="bg-[var(--color-navy-blue-500)] text-white text-xs font-bold px-2 py-1 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {userData && (
              <div className="space-y-2 text-left bg-[var(--color-light-grey-50)] p-3 md:p-4 rounded-xl text-sm md:text-base">
                <div>
                  <span className="font-semibold text-[var(--color-navy-blue-700)]">Name:</span>
                  <p className="text-[var(--color-navy-blue-800)]">{userData.fullName || "Not provided"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-[var(--color-navy-blue-700)]">Matric Number:</span>
                  <p className="text-[var(--color-navy-blue-800)]">{userData.matricNo || "Not provided"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-[var(--color-navy-blue-700)]">Email:</span>
                  <p className="text-[var(--color-navy-blue-800)]">{userData.email || "Not provided"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-[var(--color-navy-blue-700)]">Department:</span>
                  <p className="text-[var(--color-navy-blue-800)]">{userData.department || "Not provided"}</p>
                </div>
                
                <div>
                  <span className="font-semibold text-[var(--color-navy-blue-700)]">Course:</span>
                  <p className="text-[var(--color-navy-blue-800)]">{courseCode}</p>
                </div>

                {/*<div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                  <div>Image path in DB: {userData.profileImage || 'None'}</div>
                  <div>Constructed URL: {profileImageUrl || 'None'}</div>
                </div> */}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <button
            onClick={handleBackToDashboard}
            className="bg-[var(--color-navy-blue-600)] hover:bg-[var(--color-navy-blue-700)] text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-colors duration-200 shadow-md mb-2 sm:mb-0"
          >
            Back to Dashboard
          </button>
          
          <button
            onClick={refreshPage}
            className="bg-[var(--color-golden-yellow-600)] hover:bg-[var(--color-golden-yellow-700)] text-white font-semibold py-2 md:py-3 px-4 md:px-6 rounded-xl transition-colors duration-200 shadow-md"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;