//src/pages/Register

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { departments } from "./data";
import { authApi } from "./api";

const Register = () => { 
  const [fullName, setFullName] = useState<string>("");
  const [matricNo, setMatricNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null); 
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!selectedDept) {
      setError("Please select a department");
      return;
    }

    if (!file) {
      setError("Please input a picture");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        fullName,
        matricNo,
        email,
        password,
        department: selectedDept,
        profileImage: file || undefined
      });
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-light-grey-100)] px-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6 bg-white rounded-2xl shadow-xl overflow-hidden border border-[var(--color-light-grey-200)]">
        
        <div className="flex items-center justify-center bg-[var(--color-navy-blue-50)] p-8">
          <div className="w-full h-72 rounded-xl border-2 border-dashed border-[var(--color-navy-blue-400)] flex flex-col items-center justify-center text-[var(--color-navy-blue-600)] relative">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="Uploaded ID"
                className="h-full w-full object-cover rounded-xl"
              />
            ) : (
              <>
                <span className="text-lg font-semibold">Student ID Card Preview</span>
                <p className="text-sm text-[var(--color-light-grey-500)] mt-2">Upload your ID card or photo</p>
              </>
            )}

            <label className="absolute bottom-4 right-4 bg-[var(--color-navy-blue-600)] text-white w-10 h-10 flex items-center justify-center rounded-full cursor-pointer hover:bg-[var(--color-navy-blue-700)] transition-colors">
              +
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
            </label>
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[var(--color-navy-blue-700)] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-white font-bold">🎓</span>
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-navy-blue-800)]">
              Create Account 
            </h2>
            <p className="mt-2 text-[var(--color-light-grey-600)] text-sm">
              Fill in your details to register
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label 
                htmlFor="fullName"
                className="block text-sm font-medium text-[var(--color-navy-blue-700)]"  
              >
                Full Name
              </label>
              <input 
                type="text" 
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] 
                  focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                placeholder="prof radon"
                disabled={isLoading}                
              />
            </div>

            <div>
              <label
                htmlFor="matricNo"
                className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
              >
                Matric Number
              </label>
              <input
                id="matricNo"
                type="text"
                value={matricNo}
                onChange={(e) => setMatricNo(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] 
                  focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                placeholder="CSC/2022/001"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] 
                  focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                placeholder="student@university.edu"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] 
                  focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] 
                  focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-navy-blue-700)]">
                Select Department 
              </label>
              <div className="relative" ref={dropdownRef}>
                <div 
                  className="w-full mt-1 rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-light-grey-600)] cursor-pointer flex justify-between items-center hover:border-[var(--color-navy-blue-300)] transition-colors"
                  onClick={() => !isLoading && setDropdownOpen(!dropdownOpen)}
                >
                  <span className={selectedDept ? "text-[var(--color-navy-blue-800)]" : "text-[var(--color-light-grey-500)]"}>
                    {selectedDept || "-- Select Department --"}
                  </span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {dropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-[var(--color-light-grey-300)] rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                    {departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="px-4 py-3 hover:bg-[var(--color-navy-blue-50)] cursor-pointer text-left transition-colors"
                        onClick={() => {
                          setSelectedDept(dept.name);
                          setDropdownOpen(false);
                        }}
                      >
                        {dept.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-[var(--color-navy-blue-600)] text-white py-3 px-4 font-semibold hover:bg-[var(--color-navy-blue-700)] 
                transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Creating Account...
                </>
              ) : "Register"}
            </button>

            <p className="mt-6 text-center text-[var(--color-light-grey-600)] text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-[var(--color-navy-blue-600)] hover:text-[var(--color-navy-blue-700)] font-medium">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;