// API Functions
const api = {
  async login(username, password) {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return response.json();
  },

  async getCourses() {
    const response = await fetch("/courses");
    return response.json();
  },

  async getCourseMaterials(courseId) {
    const response = await fetch(`/materials/${courseId}`);
    return response.json();
  },

  async getChanges() {
    const response = await fetch("/changes");
    return response.json();
  },

  async getDeletedMaterials() {
    const response = await fetch("/deleted-materials");
    return response.json();
  },
};

// UI Update Functions
const ui = {
  displayCourses(courses) {
    const courseGrid = document.querySelector(".course-grid");
    courseGrid.innerHTML = ""; // Clear existing cards

    courses.forEach((course) => {
      // Extract course ID from link
      const courseId = course.link.split("id=")[1];

      // Count changes/new materials
      const newMaterials = course.sections
        .flatMap((section) => section.activities)
        .filter((activity) => activity && !activity.done).length;

      const cardHtml = `
                <div class="mdc-card course-card" data-course-id="${courseId}">
                    <div class="mdc-card__primary-action">
                        <div class="course-card__content">
                            <h2 class="mdc-typography--headline6">${
                              course.course
                            }</h2>
                            <div class="course-card__status">
                                ${
                                  newMaterials > 0
                                    ? `
                                    <span class="material-icons status-icon status-icon--new">fiber_new</span>
                                    <span class="status-text">${newMaterials} new items</span>
                                `
                                    : ""
                                }
                            </div>
                        </div>
                    </div>
                    <div class="mdc-card__actions">
                        <div class="mdc-card__action-buttons">
                            <button class="mdc-button mdc-card__action mdc-card__action--button view-course">
                                <span class="mdc-button__label">View Course</span>
                            </button>
                            <button class="mdc-button mdc-card__action mdc-card__action--button">
                                <span class="material-icons">notifications</span>
                                <span class="mdc-button__label">${newMaterials} Changes</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
      courseGrid.insertAdjacentHTML("beforeend", cardHtml);
    });

    // Reinitialize Material components for new cards
    document.querySelectorAll(".mdc-card__primary-action").forEach((card) => {
      mdc.ripple.MDCRipple.attachTo(card);
    });
  },

  displayCourseMaterials(courseData) {
    const courseTitle = document.getElementById("course-title");
    courseTitle.textContent = courseData.course;

    // Update current materials panel
    const currentMaterialsBody = document.querySelector(
      ".materials-panel.active tbody"
    );
    currentMaterialsBody.innerHTML = "";

    courseData.sections.forEach((section) => {
      section.activities.forEach((activity) => {
        if (!activity || !activity.activity) return;

        const row = `
                    <tr class="mdc-data-table__row">
                        <td class="mdc-data-table__cell">
                            <span class="material-icons">${this.getActivityIcon(
                              activity.activity
                            )}</span>
                        </td>
                        <td class="mdc-data-table__cell">${
                          activity.activity
                        }</td>
                        <td class="mdc-data-table__cell">${
                          this.getActivityDate(activity.desc) || "N/A"
                        }</td>
                        <td class="mdc-data-table__cell">
                            ${
                              activity.link
                                ? `
                                <a href="${activity.link}" target="_blank" class="mdc-icon-button material-icons">open_in_new</a>
                            `
                                : ""
                            }
                            <button class="mdc-icon-button material-icons">history</button>
                        </td>
                    </tr>
                `;
        currentMaterialsBody.insertAdjacentHTML("beforeend", row);
      });
    });
  },

  displayChanges(changes) {
    const changesBody = document.querySelector(
      ".materials-panel:nth-child(2) tbody"
    );
    changesBody.innerHTML = "";

    changes.forEach((change) => {
      const row = `
                <tr class="mdc-data-table__row">
                    <td class="mdc-data-table__cell">
                        <span class="material-icons change-icon--modified">edit</span>
                    </td>
                    <td class="mdc-data-table__cell">${change.activity}</td>
                    <td class="mdc-data-table__cell">${change.lastModified}</td>
                    <td class="mdc-data-table__cell">
                        <button class="mdc-button">
                            <span class="mdc-button__label">View Changes</span>
                        </button>
                    </td>
                </tr>
            `;
      changesBody.insertAdjacentHTML("beforeend", row);
    });
  },

  displayDeletedMaterials(materials) {
    const deletedBody = document.querySelector(
      ".materials-panel:nth-child(3) tbody"
    );
    deletedBody.innerHTML = "";

    materials.forEach((material) => {
      const row = `
                <tr class="mdc-data-table__row">
                    <td class="mdc-data-table__cell">
                        <span class="material-icons">assignment</span>
                    </td>
                    <td class="mdc-data-table__cell">${material.activity}</td>
                    <td class="mdc-data-table__cell">${material.dueDate}</td>
                    <td class="mdc-data-table__cell">
                        <button class="mdc-button">
                            <span class="mdc-button__label">View Archive</span>
                        </button>
                    </td>
                </tr>
            `;
      deletedBody.insertAdjacentHTML("beforeend", row);
    });
  },

  getActivityIcon(activity) {
    if (activity.toLowerCase().includes("assignment")) return "assignment";
    if (activity.toLowerCase().includes("file")) return "description";
    if (activity.toLowerCase().includes("forum")) return "forum";
    if (activity.toLowerCase().includes("url")) return "link";
    return "article";
  },

  getActivityDate(desc) {
    if (!desc) return null;
    const dateMatch = desc.match(/Due:\s*(.*?)(?=<|$)/);
    return dateMatch ? dateMatch[1].trim() : null;
  },

  showNotification(message) {
    // Add notification to the menu
    const notificationList = document.querySelector(
      "#notification-menu .mdc-list"
    );
    const notification = `
            <li class="mdc-list-item" role="menuitem">
                <span class="mdc-list-item__ripple"></span>
                <span class="material-icons mdc-list-item__graphic">info</span>
                <span class="mdc-list-item__text">
                    <span class="mdc-list-item__primary-text">${message}</span>
                    <span class="mdc-list-item__secondary-text">Just now</span>
                </span>
            </li>
        `;
    notificationList.insertAdjacentHTML("afterbegin", notification);
  },
};

// Event Handlers
document.addEventListener("DOMContentLoaded", () => {
  // Login form handler
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const result = await api.login(username, password);
      if (result.success) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("dashboard-section").style.display = "block";

        // Load initial data
        const courses = await api.getCourses();
        ui.displayCourses(courses);
      }
    } catch (error) {
      ui.showNotification("Login failed. Please try again.");
    }
  });

  // Course view handlers
  document
    .querySelector(".course-grid")
    .addEventListener("click", async (e) => {
      const card = e.target.closest(".mdc-card");
      if (!card) return;

      const courseId = card.dataset.courseId;
      if (!courseId) return;

      try {
        const materials = await api.getCourseMaterials(courseId);
        document.getElementById("course-view").style.display = "block";
        document.querySelector(".course-grid").style.display = "none";
        ui.displayCourseMaterials(materials);
      } catch (error) {
        ui.showNotification("Failed to load course materials.");
      }
    });

  // Tab switching with data loading
  const tabBar = document.querySelector(".mdc-tab-bar");
  tabBar.addEventListener("MDCTabBar:activated", async (e) => {
    const index = e.detail.index;
    try {
      if (index === 1) {
        // Changes History
        const changes = await api.getChanges();
        ui.displayChanges(changes);
      } else if (index === 2) {
        // Deleted Items
        const deletedMaterials = await api.getDeletedMaterials();
        ui.displayDeletedMaterials(deletedMaterials);
      }
    } catch (error) {
      ui.showNotification("Failed to load data.");
    }
  });

  // Poll for changes every 5 minutes
  setInterval(async () => {
    try {
      const changes = await api.getChanges();
      const newChanges = changes.filter((change) => {
        const changeDate = new Date(change.lastModified);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        return changeDate > fiveMinutesAgo;
      });

      newChanges.forEach((change) => {
        ui.showNotification(
          `New change in ${change.course}: ${change.activity}`
        );
      });
    } catch (error) {
      console.error("Error checking for changes:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes
});
