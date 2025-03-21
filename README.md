# BenChat
This is a React application built with Create React App (or Vite).
It includes features like user authentication, profile management, and a chat interface.

# Features
User authentication (login, signup, logout)
Real-time messaging
Profile management
Installation
Clone the repository.
Run npm install to install dependencies.
Run npm start to start the development server.
This project was bootstrapped with Create React App.

# Available Scripts
In the project directory, you can run:

### npm start
Runs the app in the development mode.
Open http://localhost:5173 to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### npm run cypress:open
Runs the Cypress test runner to open the UI for running tests. 
Ensure you have Cypress installed (npm install cypress --save-dev) if it's not already included in your project.

### npm run build
Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

### npm run serve
Serves the production build on port 5173. This script assumes you have a tool like serve installed (npm install -g serve) or you can use vite preview if you are using Vite.

For more information on deployment, see the Create React App documentation.

### Deployment
To deploy the application, you can use the npm run build command to create a production build and then serve it using a web server or a service like Vercel, Netlify, or GitHub Pages.

For example, using serve:

Run: npm run build
# Run: serve -s build -l 5173 to serve the build on port 5173.