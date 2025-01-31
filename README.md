# Kanban App

## Project Overview
The **Kanban App** is a task management tool that allows users to create, update, delete, and categorize tasks on a board. The application provides an interactive and responsive interface built with **React** and **TypeScript**. It uses **Firebase** for backend services like authentication and real-time data storage.

**Technologies Used:**
- **Frontend**: React, TypeScript
- **Backend**: Firebase (Firestore, Firebase Auth, Firebase Functions)

## Features
- Create, edit, and delete tasks.
- Organize tasks by categories.
- Filter tasks by date and category.
- Store task data and handle user authentication with Firebase.

## Challenges Faced with Firebase
While integrating Firebase into the project, we encountered the following challenges:
1. **Firebase Firestore Security Rules**: Ensuring secure access to data based on user authentication.
2. **Real-time Data Sync**: Managing real-time updates so that changes to tasks are reflected immediately on all devices.
3. **Firebase Authentication**: Setting up secure user authentication and handling session management.

## Getting Started

### Prerequisites
Before you begin, make sure you have the following installed on your machine:
- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)

### Setup Instructions

Follow the steps below to get your project up and running.

1. **Clone the repository:**

   Open your terminal and run the following command:

   ```bash
 
 git clone https://github.com/your-username/kanban-app.git](https://github.com/AbhishekAsthana-AA/kanban-app.git

2.**Intall Dependencies:**
nmp install

3.**Run project:**
num run dev



### Folder Structure
task-mangement-app/
│
├── src/
│   ├── assets/              # Static files (images, etc.)
│   ├── Components/          # React components
│   ├── Firebase/            # Firebase configuration and utilities
│   ├── Pages/               # React pages
|   ├── Layouts/               # Layout pages
|   ├── Utils/               # Utils data export
|   |── Routes/               # Routes
│   ├── App.tsx              # Main App component
│   └── index.tsx            # Entry point for React
│
├── public/                  # Public assets and index.html
├── .env                     # Firebase credentials and environment variables
├── package.json             # NPM dependencies and scripts
└── README.md    



