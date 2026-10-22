const dotenv = require("dotenv");
dotenv.config();

const bcrypt = require("bcrypt");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");
const Course = require("./src/models/Course");
const Enrollment = require("./src/models/Enrollment");
const QuizSubmission = require("./src/models/QuizSubmission");
const AssignmentSubmission = require("./src/models/AssignmentSubmission");

const seedIfMissing = (Model, filter, document) =>
  Model.findOneAndUpdate(filter, { $setOnInsert: document }, {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });

const seedDatabase = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    console.log("Seeding users...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const studentPassword = await bcrypt.hash("student123", 10);

    const adminUser = await seedIfMissing(User, {
      email: process.env.ADMIN_EMAIL || "admin@coursemaster.com",
    }, {
      name: "Super Admin",
      email: process.env.ADMIN_EMAIL || "admin@coursemaster.com",
      passwordHash: hashedPassword,
      role: "admin",
    });

    const student1 = await seedIfMissing(User, {
      email: "student@coursemaster.com",
    }, {
      name: "Rahim Chowdhury",
      email: "student@coursemaster.com",
      passwordHash: studentPassword,
      role: "student",
    });

    const student2 = await seedIfMissing(User, {
      email: "tamim@gmail.com",
    }, {
      name: "Tamim Hasan",
      email: "tamim@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    await seedIfMissing(User, {
      email: "sumaiya@gmail.com",
    }, {
      name: "Sumaiya Akter",
      email: "sumaiya@gmail.com",
      passwordHash: studentPassword,
      role: "student",
    });

    console.log("Seeding courses...");
    const course1 = await seedIfMissing(Course, {
      title: "Complete Web Development Masterclass with Next.js & React 19",
    }, {
      title: "Complete Web Development Masterclass with Next.js & React 19",
      description: "Master modern web development from HTML/CSS to advanced React 19, Next.js App Router, Express, and MongoDB. Includes hands-on real-world projects, live classes, quizzes, and code reviews.",
      instructorName: "Jhankar Mahbub",
      price: 5000,
      category: "Web Development",
      tags: ["React", "Next.js", "JavaScript", "Fullstack", "Node.js"],
      batches: [
        { name: "Batch 1 (Spring 2026)", startDate: new Date("2026-01-10") },
        { name: "Batch 2 (Summer 2026)", startDate: new Date("2026-06-01") },
      ],
      syllabus: [
        {
          title: "Module 1: Modern HTML, CSS & Responsive Design",
          lessons: [
            {
              title: "Lesson 1: Introduction to HTML5 & Semantic Elements",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              liveClassLink: "https://meet.google.com/abc-defg-hij",
              liveClassDate: new Date("2026-04-15T18:00:00.000Z"),
              quiz: [
                {
                  question: "Which HTML5 tag is used to specify a header for a document or section?",
                  options: ["<section>", "<header>", "<head>", "<top>"],
                  correctIndex: 1,
                },
                {
                  question: "What is the correct HTML element for inserting a line break?",
                  options: ["<break>", "<lb>", "<br>", "<line>"],
                  correctIndex: 2,
                },
              ],
            },
            {
              title: "Lesson 2: Flexbox & Grid Layouts Deep Dive",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignmentPrompt: "Build a fully responsive pricing card layout using CSS Flexbox and Grid. Submit your GitHub repository URL or live link.",
            },
          ],
        },
        {
          title: "Module 2: React 19 & State Management",
          lessons: [
            {
              title: "Lesson 1: React 19 Components, Props & Hooks",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              quiz: [
                {
                  question: "Which hook is used for handling side effects in React?",
                  options: ["useState", "useMemo", "useEffect", "useCallback"],
                  correctIndex: 2,
                },
              ],
            },
            {
              title: "Lesson 2: Redux Toolkit & Global State",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignmentPrompt: "Implement a persistent shopping cart using Redux Toolkit and LocalStorage. Submit your code repo link.",
            },
          ],
        },
      ],
    });

    const course2 = await seedIfMissing(Course, {
      title: "Python for Data Science & Machine Learning",
    }, {
      title: "Python for Data Science & Machine Learning",
      description: "Learn Python programming, NumPy, Pandas, Matplotlib, and Scikit-Learn to solve real-world data science problems and build predictive machine learning models.",
      instructorName: "Dr. Anisul Islam",
      price: 4500,
      category: "Data Science",
      tags: ["Python", "Machine Learning", "Data Science", "Pandas", "AI"],
      batches: [
        { name: "Batch 1 (2026)", startDate: new Date("2026-02-01") },
      ],
      syllabus: [
        {
          title: "Module 1: Python Fundamentals & Data Structures",
          lessons: [
            {
              title: "Lesson 1: Lists, Dictionaries, and Control Flow",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              quiz: [
                {
                  question: "How do you define a function in Python?",
                  options: ["func myFunc():", "def myFunc():", "function myFunc()", "define myFunc():"],
                  correctIndex: 1,
                },
              ],
            },
            {
              title: "Lesson 2: Exploratory Data Analysis with Pandas",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              assignmentPrompt: "Analyze the provided CSV dataset using Pandas and generate summary statistics and charts.",
            },
          ],
        },
      ],
    });

    await seedIfMissing(Course, {
      title: "Cross-Platform Mobile Development with Flutter & Dart",
    }, {
      title: "Cross-Platform Mobile Development with Flutter & Dart",
      description: "Build beautiful, high-performance native iOS and Android apps using Flutter framework and Dart programming language.",
      instructorName: "Sumit Saha",
      price: 4000,
      category: "Mobile App",
      tags: ["Flutter", "Dart", "Mobile", "Android", "iOS"],
      batches: [
        { name: "Batch 1 (2026)", startDate: new Date("2026-03-01") },
      ],
      syllabus: [
        {
          title: "Module 1: Flutter Basics & Widget Tree",
          lessons: [
            {
              title: "Lesson 1: Stateless vs Stateful Widgets",
              videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
              quiz: [
                {
                  question: "Which widget is immutable in Flutter?",
                  options: ["StatefulWidget", "StatelessWidget", "InheritedWidget", "DynamicWidget"],
                  correctIndex: 1,
                },
              ],
            },
          ],
        },
      ],
    });

    console.log("Seeding enrollments...");
    const lesson1Id = course1.syllabus[0].lessons[0]._id;

    await seedIfMissing(Enrollment, {
      student: student1._id,
      course: course1._id,
    }, {
      student: student1._id,
      course: course1._id,
      batchId: course1.batches[0]._id,
      progress: {
        completedLessons: [lesson1Id],
        percent: 25,
      },
    });

    await seedIfMissing(Enrollment, {
      student: student1._id,
      course: course2._id,
    }, {
      student: student1._id,
      course: course2._id,
      batchId: course2.batches[0]._id,
      progress: {
        completedLessons: [],
        percent: 0,
      },
    });

    await seedIfMissing(Enrollment, {
      student: student2._id,
      course: course1._id,
    }, {
      student: student2._id,
      course: course1._id,
      batchId: course1.batches[0]._id,
      progress: {
        completedLessons: [lesson1Id],
        percent: 25,
      },
    });

    console.log("Seeding quiz and assignment submissions...");
    await seedIfMissing(QuizSubmission, {
      student: student1._id,
      course: course1._id,
      lessonId: lesson1Id,
    }, {
      student: student1._id,
      course: course1._id,
      lessonId: lesson1Id,
      answers: [1, 2],
      score: 2,
      total: 2,
      percent: 100,
    });

    const lesson2Id = course1.syllabus[0].lessons[1]._id;
    await seedIfMissing(AssignmentSubmission, {
      student: student1._id,
      course: course1._id,
      lessonId: lesson2Id,
    }, {
      student: student1._id,
      course: course1._id,
      lessonId: lesson2Id,
      answerType: "link",
      answer: "https://github.com/rahim/pricing-card-assignment",
      status: "reviewed",
      reviewer: adminUser._id,
      reviewNotes: "Great job! Responsive layout looks clean across mobile and desktop.",
      grade: 95,
    });

    console.log("Database Seeded Successfully! ✅");
    console.log("-----------------------------------------");
    console.log("Admin Account:");
    console.log(`Email: ${adminUser.email}`);
    console.log("Password: admin123");
    console.log("-----------------------------------------");
    console.log("Student Account:");
    console.log(`Email: ${student1.email}`);
    console.log("Password: student123");
    console.log("-----------------------------------------");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
