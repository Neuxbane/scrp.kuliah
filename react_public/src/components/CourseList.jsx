import React, { useEffect, useState } from "react";
import { CourseCard } from "./CourseCard";
import { Typography } from "@material-tailwind/react";

export function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch("/api/courses");
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      const data = await response.json();
      setCourses(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="font-jakarta text-gray-600">
          Loading your courses...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600 font-jakarta">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Typography
        variant="h3"
        className="font-montserrat font-bold text-gray-800 mb-8"
      >
        My Courses
      </Typography>
      <div className="grid gap-6">
        {courses.map((course) => (
          <CourseCard key={course.code} course={course} />
        ))}
      </div>
    </div>
  );
}
