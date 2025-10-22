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
    <Card className="course-card mb-4">
      <CardHeader
        onClick={toggleExpand}
        className="cursor-pointer flex justify-between items-center p-4 bg-gray-50"
      >
        <div>
          <Typography variant="h5" color="blue-gray">
            {course.name}
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            {course.code}
          </Typography>
        </div>
        <IconButton variant="text" size="sm">
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </IconButton>
      </CardHeader>
      {isExpanded && (
        <CardBody>
          <div className="course-card__status">
            <div className="status-text">
              Last Updated: {new Date(course.lastUpdate).toLocaleDateString()}
            </div>
            {course.isNew && (
              <div className="flex items-center">
                <span className="status-icon--new">●</span>
                <span className="status-text ml-1">New</span>
              </div>
            )}
          </div>
          {course.materials && course.materials.length > 0 && (
            <div className="mt-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Materials
              </Typography>
              <ul className="space-y-2">
                {course.materials.map((material, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-blue-600">●</span>
                    <Typography>{material.name}</Typography>
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
