# Boardhub

Boardhub is a full-stack web application inspired by Padlet, developed solely for educational purposes as part of my software engineering journey. It showcases my skills in designing and building a collaborative platform that allows users to create, organize, and share content in a visually appealing and interactive manner. Boardhub demonstrates my proficiency in various web technologies and serves as a practical application of key concepts such as user authentication, real-time collaboration, and responsive design. While inspired by Padlet, it is important to note that Boardhub is created exclusively for learning and personal growth, adhering to fair use principles. I am excited to share this project with the GitHub community and welcome any feedback or contributions that can help me enhance my skills as a software engineer.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features
- User registration and authentication
- Create, read, update, and delete boards
- Add, edit, and delete cards within boards
- Drag and drop functionality for organizing cards
- Real-time collaboration and updates
- Section-based organization of cards
- Customizable board backgrounds
- Responsive design for seamless usage across devices

## Technologies Used
- Frontend:
  - React
  - Redux
  - Material-UI
  - Axios
- Backend:
  - Node.js
  - Express.js
  - MySQL
  - Sequelize ORM
- Authentication:
  - JSON Web Tokens (JWT)
  - Bcrypt for password hashing
- File Upload:
  - Multer for handling file uploads
- Real-time Updates:
  - Socket.IO (planned feature)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL database

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/boardhub.git
   ```

2. Navigate to the project directory:
   ```
   cd boardhub
   ```

3. Install the dependencies for both the backend and frontend:
   ```
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. Set up the environment variables:
   - Create a `.env` file in the `backend` directory.
   - Provide the necessary environment variables (e.g., database connection details, JWT secret).

5. Set up the database:
   - Create a MySQL database for the project.
   - Update the database connection details in the `backend/config/config.js` file.

6. Run the database migrations:
   ```
   cd backend
   npx sequelize-cli db:migrate
   ```

7. Start the development servers:
   - For the backend:
     ```
     cd backend
     npm start
     ```
   - For the frontend:
     ```
     cd frontend
     npm start
     ```

8. Open your browser and visit `http://localhost:3000` to access the application.

## Usage
1. Register a new account or log in with an existing account.
2. Create a new board by clicking on the "Create Board" button.
3. Customize the board title, background, and other settings.
4. Add cards to the board by clicking on the "Add Card" button.
5. Edit, delete, or rearrange cards as needed.
6. Collaborate with others by sharing the board link.
7. Explore additional features such as section-based organization and real-time updates.

## API Documentation
The backend API documentation can be found [here](API_DOCS.md). It provides details on the available endpoints, request/response formats, and authentication requirements.

## Database Schema
The database schema for Boardhub can be found [here](DATABASE_SCHEMA.md). It outlines the structure of the database tables and their relationships.

## Contributing
Contributions are welcome! If you'd like to contribute to Boardhub, please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure that the code passes all tests.
4. Submit a pull request detailing your changes.

Please refer to the [contribution guidelines](CONTRIBUTING.md) for more information.

## License
This project is licensed under the [MIT License](LICENSE).

## Author
- YASSINE MTEJJAL

Thank you for checking out Boardhub! I hope you find it informative and valuable in understanding my software engineering journey.
