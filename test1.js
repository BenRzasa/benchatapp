const { spawn } = require("cross-spawn");
const puppeteer = require("puppeteer");
const open = require("open"); // Correct import statement

// Start the development server
const startServer = () => {
  return new Promise((resolve, reject) => {
    const server = spawn("npm", ["start"]);

    // Wait for the server to be ready
    server.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(output); // Log server output for debugging

      // Check for the "Compiled successfully!" message
      if (output.includes("Compiled successfully!")) {
        console.log("Server is ready.");
        resolve(server);
      }
    });

    server.stderr.on("data", (data) => {
      const errorOutput = data.toString();

      // Ignore deprecation warnings
      if (errorOutput.includes("DeprecationWarning")) {
        console.warn(errorOutput); // Log deprecation warnings
      } else {
        console.error(`Server error: ${errorOutput}`);
        reject(new Error("Server failed to start"));
      }
    });

    server.on("close", (code) => {
      reject(new Error(`Server process exited with code ${code}`));
    });
  });
};

// Automate the login process
const automateLogin = async () => {
  let browser;
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navigate to the login page
    await page.goto("http://localhost:5173/login");

    // Fill in the login form
    await page.type('input[type="email"]', "test1@gmail.com");
    await page.type('input[type="password"]', "password");

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for navigation to the main page
    await page.waitForNavigation();

    console.log("Login successful!");
  } catch (error) {
    console.error("Error during login automation:", error);
  } finally {
    // Remove this block to keep the browser open
    if (browser) {
      await browser.close();
    }
  }
};

// Main function
const main = async () => {
  let server;
  try {
    server = await startServer();
    console.log("Development server started.");

    // Add a small delay to ensure the server is fully ready
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Open the app in the default browser
    await open("http://localhost:5173"); // Correct usage of open

    // Automate the login process
    await automateLogin();

    // Do not kill the server here
    console.log("Login automation complete. The server is still running.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Optionally, you can close the server here if needed
    if (server) {
      server.kill();
    }
  }
};

// Run the script
main();