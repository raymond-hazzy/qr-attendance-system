// src/pages/api.ts
const API_BASE_URL = 'http://localhost:5000/api';

export interface LoginRequest {
  matricNo: string;
  password: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  matricNo: string;
  email: string;
  password: string;
  department: string;
  profileImage?: File;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    matricNo: string;
    email: string;
    department: string;
    role?: string;
    profileImage?: string;
  };
}

export interface ApiError {
  message: string;
  status: number;
}

export interface QRCodeResponse {
  qrCode: string;
  expiresIn: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  matricNo: string;
  fullName: string;
  courseCode: string;
  lastScanned: string;
  scanCount: number;
  profileImage?: string;
}

export interface Course {
  code: string;
  name: string;
  department?: string;
}

export interface SummaryData {
  registeredCount: number;
  todayScans: number;
  courseName: string;
}

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      try {
        const errorText = await response.text();
        errorData = { message: errorText || `HTTP error! status: ${response.status}` };
      } catch {
        errorData = { message: `HTTP error! status: ${response.status}` };
      }
    }
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return authToken || localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
};

const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const token = getAuthToken();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const newToken = data.token;
      setAuthToken(newToken);
      return newToken;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearAuthToken();
  }
  return null;
};

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const isFormData = options.body instanceof FormData;
  const optionsHeaders = new Headers(options.headers);
  const hasContentTypeInOptions = optionsHeaders.has('Content-Type');
  
  if (!isFormData && !hasContentTypeInOptions) {
    headers['Content-Type'] = 'application/json';
  }

  const mergedHeaders: HeadersInit = {
    ...headers,
  };

  optionsHeaders.forEach((value, key) => {
    if (key.toLowerCase() !== 'authorization') {
      mergedHeaders[key] = value;
    }
  });

  const finalOptions: RequestInit = {
    ...options,
    headers: mergedHeaders,
  };

  let response = await fetch(url, finalOptions);

  if (response.status === 401 && token && !isFormData) {
    const newToken = await refreshAuthToken();
    if (newToken) {
      const retryHeaders: HeadersInit = {
        ...mergedHeaders,
        'Authorization': `Bearer ${newToken}`,
      };
      
      const retryOptions: RequestInit = {
        ...options,
        headers: retryHeaders,
      };
      
      response = await fetch(url, retryOptions);
    }
  }

  return response;
};

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    setAuthToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  },

  adminLogin: async (credentials: AdminLoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await handleResponse(response);
    setAuthToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    localStorage.setItem('userRole', data.user.role || 'admin');
    return data;
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const formData = new FormData();
    formData.append('fullName', userData.fullName);
    formData.append('matricNo', userData.matricNo);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('department', userData.department);
    
    if (userData.profileImage) {
      formData.append('profileImage', userData.profileImage);
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await handleResponse(response);
    setAuthToken(data.token);
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
    });
    return handleResponse(response);
  },
  getProfile: async (): Promise<AuthResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/auth/me`);
    const data = await handleResponse(response);
    localStorage.setItem('userData', JSON.stringify(data.user));
    return data;
},
};

export const coursesApi = {
  getCourses: async (departmentId: string): Promise<Course[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/courses/${departmentId}`);
    return handleResponse(response);
  },

  getDepartments: async (): Promise<any[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/courses`);
    return handleResponse(response);
  },

  getAllCourses: async (): Promise<Course[]> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/courses/all/courses`);
    return handleResponse(response);
  },
};

export const attendanceApi = {
  markAttendance: async (encryptedData: string): Promise<any> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/attendance/mark`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedData }),
    });
    return handleResponse(response);
  },

  generateQRCode: async (courseCode: string): Promise<QRCodeResponse> => {
    const response = await fetchWithAuth(`${API_BASE_URL}/attendance/qr-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseCode }),
    });
    return handleResponse(response);
  },

  getAttendanceList: async (course?: string): Promise<AttendanceRecord[]> => {
    const url = course && course !== 'all' 
      ? `${API_BASE_URL}/attendance/list?course=${course}`
      : `${API_BASE_URL}/attendance/list`;
    
    const response = await fetchWithAuth(url);
    return handleResponse(response);
  },

  getAttendanceSummary: async (course?: string): Promise<SummaryData> => {
    const url = course && course !== 'all' 
      ? `${API_BASE_URL}/attendance/summary?course=${course}`
      : `${API_BASE_URL}/attendance/summary`;
    
    const response = await fetchWithAuth(url);
    return handleResponse(response);
  },
};