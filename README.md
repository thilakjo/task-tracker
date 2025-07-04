🚀 Task Tracker Application
A sleek and intuitive task management application built with React, designed to help users organize their daily tasks efficiently. Featuring a modern glassmorphism UI, dark mode, and robust task management functionalities, this application provides a seamless experience for tracking your to-dos.

✨ Features
User Authentication: Simple login functionality to personalize the experience.

Add Tasks: Easily add new tasks with a title (required), description, priority (Low, Medium, High), due date, and tags.

Manage Tasks:

Mark tasks as Completed.

Edit existing tasks.

Delete tasks.

Filter Tasks: Filter tasks by "All", "Completed", or "Pending" status.

Search Functionality: Quickly find tasks by title, description, or tags using a dynamic search bar.

Date Picker Integration: Utilize an interactive date picker for setting and managing task due dates, including "Today" and "Tomorrow" quick-select buttons.

Dark Mode Toggle: Switch between light and dark themes for comfortable viewing in any environment.

Responsive Design: Optimized for a smooth user experience across various devices (desktop, tablet, mobile).

Glassmorphism UI: A modern, translucent design aesthetic for a visually appealing interface.

🛠️ Technologies Used
React.js: A JavaScript library for building user interfaces.

CSS3: For styling, including custom properties (CSS Variables) for theme management and responsive design.

react-datepicker: A popular and flexible date picker component for React.

Webpack (via Create React App): For bundling and development server.

🚀 Installation & Setup
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm (Node Package Manager) or Yarn

Steps
Clone the repository:

git clone <repository-url>
cd task-tracker

(Replace <repository-url> with the actual URL of your Git repository.)

Install dependencies:

npm install

# OR

yarn install

Run the development server:

npm start

# OR

yarn start

This will start the application in development mode. Open http://localhost:3000 to view it in your browser.

The page will reload if you make edits. You will also see any lint errors in the console.

💡 Usage
Login
Upon launching the application, you'll be presented with a simple login screen. Enter any username to proceed to the task dashboard. Your username will be remembered for future sessions.

Adding a Task
Enter the task title in the "Task Title (required)" input field.

Optionally, add a description, select a priority, set a due date using the date picker or quick buttons ("Today", "Tomorrow"), and add comma-separated tags.

Click the "Add Task" button.

Managing Tasks
Mark as Complete: Click the checkbox next to a task to toggle its completion status.

Edit Task: Click the "Edit" button on a task to modify its details.

Delete Task: Click the "Delete" button on a task to remove it. A confirmation modal will appear.

Filtering Tasks
Use the filter buttons ("All", "Completed", "Pending") above the task list to view tasks based on their status.

Searching Tasks
Type into the search bar to dynamically filter tasks by their title, description, or tags.

Dark Mode
Click the "Dark Mode" toggle button in the dashboard header to switch between light and dark themes. Your preference will be saved.

📂 Project Structure
.
├── public/ # Public assets (index.html, manifest, etc.)
├── src/
│ ├── App.css # Global application styles
│ ├── App.js # Main application component, handles routing/state
│ ├── components/ # Reusable React components
│ │ ├── ConfirmationModal.js
│ │ ├── Login.js
│ │ ├── TaskDashboard.js
│ │ ├── TaskFilter.js
│ │ ├── TaskForm.js
│ │ ├── TaskItem.js
│ │ └── TaskList.js
│ ├── index.css # Root CSS for basic HTML elements
│ ├── index.js # React app entry point
│ ├── styles/ # Component-specific CSS files
│ │ ├── ConfirmationModal.css
│ │ ├── DatePickerCustom.css # Custom styles for react-datepicker
│ │ ├── Login.css
│ │ ├── TaskDashboard.css
│ │ ├── TaskFilter.css
│ │ ├── TaskForm.css
│ │ ├── TaskItem.css
│ │ └── TaskList.css
│ └── utils/ # Utility functions (e.g., localStorage management)
│ └── localStorage.js
├── package.json # Project dependencies and scripts
└── README.md # This file

🎨 Styling & Design
The application features a modern Glassmorphism design, characterized by translucent, frosted-glass effects. This aesthetic is achieved using rgba colors, backdrop-filter: blur(), and subtle shadows. The design is fully responsive, adapting gracefully to different screen sizes, from mobile devices to large desktop displays.

🤝 Contributing
Contributions are welcome! If you have suggestions for improvements or find any bugs, please open an issue or submit a pull request.

📄 License
This project is open source and available under the MIT License.
