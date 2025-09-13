// src/pages/data.ts 
export interface Course {
  id: string;
  code: string;
  name: string;
  department: string; 
}

export interface Department {
  id: string;
  name: string;
  courses: Course[];
}

export const courseDepartmentMap: { [key: string]: string } = {
  "MTH 202": "CSC with math",
  "CSC 201": "CSC with math",
  "CSC 205": "CSC with math",
  "ECN 204": "CSC with ECN",
  "CSC 203": "CSC with ECN",
  "EEE 202": "Computer Engineering",
  "CPE 204": "Computer Engineering",
  "MEE 204": "Computer Engineering",
  "MEE 206": "Computer Engineering"
};

export const departments: Department[] = [
  {
    id: "csc_math",
    name: "CSC with math",
    courses: [
      { id: "mth202", code: "MTH 202", name: "Advanced Mathematics", department: "CSC with math" },
      { id: "csc201", code: "CSC 201", name: "Programming Concepts", department: "CSC with math" },
      { id: "csc205", code: "CSC 205", name: "Discrete Structures", department: "CSC with math" },
    ],
  },
  {
    id: "csc_ecn",
    name: "CSC with ECN",
    courses: [
      { id: "ecn204", code: "ECN 204", name: "Microeconomics", department: "CSC with ECN" },
      { id: "csc201", code: "CSC 201", name: "Programming Concepts", department: "CSC with ECN" },
      { id: "csc203", code: "CSC 203", name: "Data Structures", department: "CSC with ECN" },
    ],
  },
  {
    id: "comp_eng",
    name: "Computer Engineering",
    courses: [
      { id: "eee202", code: "EEE 202", name: "Circuit Theory", department: "Computer Engineering" },
      { id: "cpe204", code: "CPE 204", name: "Digital Logic Design", department: "Computer Engineering" },
      { id: "mee204", code: "MEE 204", name: "Thermodynamics", department: "Computer Engineering" },
      { id: "mee206", code: "MEE 206", name: "Engineering Mechanics", department: "Computer Engineering" },
    ],
  },
];

export const getDepartmentByCourse = (courseCode: string): string => {
  return courseDepartmentMap[courseCode] || "Unknown Department";
};

export const getAllCourses = (): Course[] => {
  const allCourses: Course[] = [];
  const seen = new Set();
  
  departments.forEach(dept => {
    dept.courses.forEach(course => {
      if (!seen.has(course.code)) {
        seen.add(course.code);
        allCourses.push(course);
      }
    });
  });
  
  return allCourses.sort((a, b) => a.code.localeCompare(b.code));
};

export const quotes = [
  "Believe you can and you're halfway there.",
  "Success doesn't come to you, you go to it.",
  "Don't watch the clock; do what it does. Keep going.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
];