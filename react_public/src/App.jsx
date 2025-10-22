import React from "react";
import { CourseList } from "./components/CourseList";
import { ThemeProvider } from "@material-tailwind/react";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <h1 className="text-2xl font-semibold">UAJY Course Tracker</h1>
        </header>
        <main className="container mx-auto py-6">
          <CourseList />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
