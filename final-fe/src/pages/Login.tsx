//src/pages/Login

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "./api";

const Login = () => {
  const [matricNo, setMatricNo] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loginType, setLoginType] = useState<"student" | "admin">("student");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (loginType === "student") {
        const response = await authApi.login({ matricNo, password });
        
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        navigate("/dashboard");
        
      } else {
        const response = await authApi.adminLogin({ email, password });

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('userRole', response.user.role || 'admin');
        navigate("/lecturer-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-light-grey-100)] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-[var(--color-light-grey-200)]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-navy-blue-700)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">🎓</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--color-navy-blue-800)]">
            Welcome Back
          </h2>
          <p className="mt-2 text-[var(--color-light-grey-600)] text-sm">
            Sign in to continue to your account
          </p>
        </div>

        <div className="flex bg-[var(--color-light-grey-100)] rounded-lg p-1 mb-6 border border-[var(--color-light-grey-200)]">
          <button
            type="button"
            onClick={() => setLoginType("student")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === "student"
                ? "bg-[var(--color-navy-blue-600)] text-white shadow-sm"
                : "text-[var(--color-light-grey-600)] hover:text-[var(--color-navy-blue-700)]"
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => setLoginType("admin")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              loginType === "admin"
                ? "bg-[var(--color-navy-blue-600)] text-white shadow-sm"
                : "text-[var(--color-light-grey-600)] hover:text-[var(--color-navy-blue-700)]"
            }`}
          >
            Admin Login
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {loginType === "student" ? (
            <>
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
                  className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                  placeholder="CSC/2045/111"
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
                  className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                  placeholder="admin@university.edu"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="adminPassword"
                  className="block text-sm font-medium text-[var(--color-navy-blue-700)]"
                >
                  Password
                </label>
                <input
                  id="adminPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-[var(--color-light-grey-300)] px-3 py-2 text-[var(--color-navy-blue-800)] focus:border-[var(--color-navy-blue-500)] focus:ring focus:ring-[var(--color-navy-blue-200)]"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="rounded border-[var(--color-light-grey-300)] text-[var(--color-navy-blue-600)] focus:ring-[var(--color-navy-blue-500)]" 
                disabled={isLoading}
              />
              <span className="text-[var(--color-light-grey-600)]">Remember me</span>
            </label>
            <a href="#" className="text-[var(--color-navy-blue-600)] hover:text-[var(--color-navy-blue-700)]">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-[var(--color-navy-blue-600)] px-4 py-3 text-white font-semibold shadow-md hover:bg-[var(--color-navy-blue-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {loginType === "student" && (
          <p className="mt-6 text-center text-[var(--color-light-grey-600)] text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--color-navy-blue-600)] hover:text-[var(--color-navy-blue-700)] font-medium">
              Register Now
            </Link>
          </p>
        )}

          {loginType === "admin" && (
          <p className="mt-4 text-center text-sm text-[var(--color-light-grey-500)] bg-[var(--color-golden-yellow-50)] p-2 rounded-lg border border-[var(--color-golden-yellow-200)]">
            🛡️ Admin access requires authorized credentials
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;