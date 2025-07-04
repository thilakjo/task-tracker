# Task Tracker App

A modern and intuitive web application for managing your daily tasks, built with React. This app provides a clean, user-friendly interface with glassmorphism design elements, dark mode support, and essential task management features like adding, updating, deleting, filtering, and marking tasks as complete.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Styling & Design](#styling--design)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication (Local Storage)**: Simple login system that remembers the last logged-in user.
- **Task Management**:
  - Add new tasks with title, description, priority (Low, Medium, High), due date, and tags.
  - Edit existing tasks.
  - Mark tasks as completed.
  - Delete tasks with confirmation.
- **Filtering**: Filter tasks by "All", "Active", and "Completed" status.
- **Persistent Storage**: Tasks are saved locally in the browser's `localStorage`, ensuring data persists across sessions for the logged-in user.
- **Intuitive UI**: Clean, modern interface with a responsive design.
- **Glassmorphism Design**: Stylish translucent elements for a unique aesthetic.
- **Dark Mode Toggle**: Seamlessly switch between light and dark themes.
- **Date Picker**: Integrated `react-datepicker` for easy due date selection, including "Today" and "Tomorrow" quick options.
- **Priority Highlighting**: Tasks are visually differentiated by priority levels.

## Technologies Used

- **React.js**: Frontend JavaScript library for building user interfaces.
- **CSS**: For all styling, with a focus on CSS variables for theme management.
- **`react-datepicker`**: A flexible and customizable date picker component.
- **Local Storage API**: For client-side data persistence.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: [Download & Install Node.js](https://nodejs.org/en/download/) (which includes npm)
- **npm** (Node Package Manager) or **Yarn**: Usually comes with Node.js.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/thilakjo/task-tracker.git
    cd task-tracker
    ```

    _(The repository URL is now specific to yours)_

2.  **Install dependencies:**
    ```bash
    npm install
    # or if you use yarn
    # yarn install
    ```

### Running the Application

After installation, you can run the application in development mode:

```bash
npm start
# or if you use yarn
# yarn start
```

This will open the application in your default web browser at http://localhost:3000. The page will reload if you make edits. You will also see any lint errors in the console.

---

### **Part 3: Project Structure**

```
## Project Structure

.
├── public/ # Static assets (index.html, favicon, etc.)
├── src/
│ ├── App.css # Global application styles (variables, base)
│ ├── App.js # Main application component
│ ├── components/ # Reusable UI components
│ │ ├── ConfirmationModal.js
│ │ ├── Login.js
│ │ ├── TaskDashboard.js
│ │ ├── TaskFilter.js
│ │ ├── TaskForm.js
│ │ ├── TaskItem.js
│ │ └── TaskList.js
│ ├── index.css # Root CSS for basic HTML elements
│ ├── index.js # Entry point of the React application
│ ├── styles/ # Dedicated folder for component-specific CSS modules
│ │ ├── ConfirmationModal.css
│ │ ├── DatePickerCustom.css # Custom styles for react-datepicker
│ │ ├── Login.css
│ │ ├── TaskDashboard.css
│ │ ├── TaskFilter.css
│ │ ├── TaskForm.css
│ │ ├── TaskItem.css
│ │ └── TaskList.css
│ └── utils/ # Utility functions (e.g., localStorage helpers)
│ └── localStorage.js
├── package.json # Project dependencies and scripts
├── README.md # This file
└── ...

```

## Usage

1.  **Login:** Upon opening the app, you'll be prompted to log in. Enter any username (it's stored locally).
2.  **Add a Task:** Use the form at the top to add new tasks.
    - **Title (required)**: A brief name for your task.
    - **Description (optional)**: More details about the task.
    - **Priority**: Select Low, Medium, or High.
    - **Due Date (optional)**: Pick a date using the calendar or click "Today"/"Tomorrow".
    - **Tags (optional)**: Add comma-separated tags (e.g., "work, personal, urgent").
3.  **Manage Tasks:**
    - **Toggle Dark Mode**: Use the switch in the dashboard header.
    - **Filter Tasks**: Use the "All", "Active", "Completed" buttons to filter the task list.
    - **Mark Complete**: Click the checkbox next to a task to mark it as complete/incomplete.
    - **Edit Task**: Click the edit icon to modify a task's details.
    - **Delete Task**: Click the trash can icon. A confirmation modal will appear.
4.  **Logout**: Click the "Logout" button in the header to return to the login screen. Your tasks will remain saved for your username.

## Styling & Design

The application utilizes a **glassmorphism** design, characterized by frosted glass effects, translucency, and subtle shadows. This aesthetic is achieved using CSS properties like `backdrop-filter: blur()`, `rgba()` colors, and `box-shadow`.

Global CSS variables defined in `src/App.css` are used to manage colors and theme-specific values, allowing for a seamless **Dark Mode** toggle across the application.

Custom styles for the `react-datepicker` are applied in `src/styles/DatePickerCustom.css` to integrate it visually with the app's glassmorphism theme and ensure proper layering.

## Future Enhancements

- **Backend Integration**: Replace `localStorage` with a proper database and API for multi-device sync and more robust data handling.
- **User Accounts**: Implement full user registration and authentication with secure password handling.
- **Task Sorting**: Add options to sort tasks by due date, priority, or creation date.
- **Notifications**: Implement browser notifications for upcoming task due dates.
- **Search Functionality**: Allow users to search tasks by keywords in title, description, or tags.
- **Tag Management**: A dedicated interface for managing tags.
- **Drag-and-Drop Reordering**: Allow reordering of tasks within the list.
- **More Advanced Filters**: Filter by priority, date range, or specific tags.

## Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please follow these steps:

1.  Fork the [repository](https://github.com/thilakjo/task-tracker).
2.  Create a new branch (`git checkout -b feature/your-feature-name` or `fix/bug-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the existing style and conventions.

## Author

**Thilak S**

- **Portfolio:** [thilakjo.com](https://thilakjo.com)
- **GitHub:** [thilakjo](https://github.com/thilakjo)
- **LinkedIn:** [Thilak J](https://www.linkedin.com/in/thilakjo/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
_(You might need to create a `LICENSE` file in your root directory if you haven't already.)_
