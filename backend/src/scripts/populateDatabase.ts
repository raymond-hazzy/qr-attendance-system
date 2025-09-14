// scripts/populateDatabase.ts
import mongoose from 'mongoose';
import Department from '../models/Department';
import Course from '../models/Course';
import dotenv from 'dotenv';

dotenv.config();

const departmentsData = [
  {
    name: 'CSC with math',
    courses: [
      { code: 'MTH 202', name: 'Advanced Mathematics' },
      { code: 'CSC 201', name: 'Programming Concepts' },
      { code: 'CSC 205', name: 'Discrete Structures' }
    ]
  },
  {
    name: 'CSC with ECN',
    courses: [
      { code: 'ECN 204', name: 'Microeconomics' },
      { code: 'CSC 201', name: 'Programming Concepts' },
      { code: 'CSC 203', name: 'Data Structures' }
    ]
  },
  {
    name: 'Computer Engineering',
    courses: [
      { code: 'EEE 202', name: 'Circuit Theory' },
      { code: 'CPE 204', name: 'Digital Logic Design' },
      { code: 'MEE 204', name: 'Thermodynamics' },
      { code: 'MEE 206', name: 'Engineering Mechanics' }
    ]
  },
  {
    name: 'Administration',
    courses: []
  }
];

async function populateDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qr-attendance';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    await Department.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    for (const deptData of departmentsData) {
      const department = new Department({
        name: deptData.name,
        courses: deptData.courses
      });
      await department.save();

      for (const courseData of deptData.courses) {
        const course = new Course({
          code: courseData.code,
          name: courseData.name,
          department: deptData.name
        });
        await course.save();
      }
    }

    console.log('Database populated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

populateDatabase();