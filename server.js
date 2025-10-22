const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Session validation middleware
const validateSession = (req, res, next) => {
  const sessionCookie = req.cookies.MoodleSession;
  if (!sessionCookie) {
    return res.status(401).json({ error: "Unauthorized - No session cookie" });
  }
  next();
};

// Routes
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Here you would normally validate against a database
  // For demo purposes, we'll just create a session cookie
  res.cookie("MoodleSession", "t2l5iodfeteadinj23jr7ljdgt", {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
  });

  res.json({ success: true });
});

app.get("/courses", validateSession, (req, res) => {
  try {
    const coursesData = fs.readFileSync(
      path.join(__dirname, "courses.json"),
      "utf8"
    );
    const courses = JSON.parse(coursesData);
    res.json(courses);
  } catch (error) {
    console.error("Error reading courses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/materials/:courseId", validateSession, (req, res) => {
  try {
    const coursesData = fs.readFileSync(
      path.join(__dirname, "courses.json"),
      "utf8"
    );
    const courses = JSON.parse(coursesData);

    const course = courses.find((c) => c.link.includes(req.params.courseId));
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Return course materials
    res.json({
      course: course.course,
      sections: course.sections,
    });
  } catch (error) {
    console.error("Error reading course materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Track changes in materials
app.get("/changes", validateSession, (req, res) => {
  try {
    const coursesData = fs.readFileSync(
      path.join(__dirname, "courses.json"),
      "utf8"
    );
    const courses = JSON.parse(coursesData);

    // Get all recent changes across courses
    const changes = courses.reduce((acc, course) => {
      const courseChanges = course.sections
        .flatMap((section) => section.activities)
        .filter((activity) => activity && activity.desc)
        .map((activity) => ({
          course: course.course,
          activity: activity.activity,
          link: activity.link,
          done: activity.done,
          lastModified: activity.desc.includes("Due:")
            ? activity.desc.match(/Due:\s*(.*?)(?=<|$)/)[1].trim()
            : null,
        }))
        .filter((change) => change.lastModified);

      return [...acc, ...courseChanges];
    }, []);

    res.json(changes);
  } catch (error) {
    console.error("Error tracking changes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get deleted materials
app.get("/deleted-materials", validateSession, (req, res) => {
  try {
    const coursesData = fs.readFileSync(
      path.join(__dirname, "courses.json"),
      "utf8"
    );
    const courses = JSON.parse(coursesData);

    // Get activities marked as deleted or with past due dates
    const deletedMaterials = courses.reduce((acc, course) => {
      const deletedItems = course.sections
        .flatMap((section) => section.activities)
        .filter((activity) => {
          if (!activity || !activity.desc) return false;

          // Check if the activity has a due date that has passed
          const dueDateMatch = activity.desc.match(/Due:\s*(.*?)(?=<|$)/);
          if (dueDateMatch) {
            const dueDate = new Date(dueDateMatch[1].trim());
            const now = new Date();
            return dueDate < now;
          }
          return false;
        })
        .map((activity) => ({
          course: course.course,
          activity: activity.activity,
          link: activity.link,
          dueDate: activity.desc.match(/Due:\s*(.*?)(?=<|$)/)[1].trim(),
        }));

      return [...acc, ...deletedItems];
    }, []);

    res.json(deletedMaterials);
  } catch (error) {
    console.error("Error getting deleted materials:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Logout route
app.post("/logout", (req, res) => {
  res.clearCookie("MoodleSession");
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
