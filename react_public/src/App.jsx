import React from "react";
import { CourseList } from "./components/CourseList";
import { ThemeProvider } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="app-header p-6 shadow-lg">
          <div className="container mx-auto">
            <h1 className="text-3xl font-montserrat font-bold tracking-tight">
              UAJY Course Tracker
            </h1>
            <p className="text-blue-100 font-jakarta mt-1">
              Track your academic journey
            </p>
          </div>
        </header>
        <main className="container mx-auto py-8 px-4">
          <CourseList />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
