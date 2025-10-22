import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export function CourseCard({ course }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="course-card mb-6">
      <CardHeader
        onClick={toggleExpand}
        className="course-header cursor-pointer flex justify-between items-center p-5"
      >
        <div>
          <Typography variant="h5" className="course-title">
            {course.name}
          </Typography>
          <Typography className="course-code mt-1">{course.code}</Typography>
        </div>
        <IconButton
          variant="text"
          size="sm"
          className="text-gray-500 hover:text-blue-600 transition-colors"
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </IconButton>
      </CardHeader>
      {isExpanded && (
        <CardBody className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="font-jakarta text-sm text-gray-600">
              Last Updated: {new Date(course.lastUpdate).toLocaleDateString()}
            </div>
            {course.isNew && (
              <div className="status-badge status-badge--new">New Content</div>
            )}
          </div>
          {course.materials && course.materials.length > 0 && (
            <div className="materials-list">
              <Typography
                variant="h6"
                className="font-montserrat text-gray-800 mb-3"
              >
                Materials
              </Typography>
              <ul className="space-y-1">
                {course.materials.map((material, index) => (
                  <li key={index} className="material-item">
                    <span className="material-icon">•</span>
                    <Typography className="font-jakarta">
                      {material.name}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardBody>
      )}
    </Card>
  );
}
