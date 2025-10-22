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
    return <div className="p-4">Loading courses...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <Typography variant="h3" className="mb-6">
        My Courses
      </Typography>
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course.code} course={course} />
        ))}
      </div>
    </div>
  );
}
