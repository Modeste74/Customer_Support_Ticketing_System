<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket System Frontend - README</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            line-height: 1.6;
            color: #333;
            max-width: 900px;
            margin: 20px auto;
            padding: 0 20px;
            background-color: #f6f8fa;
        }
        h1, h2, h3, h4, h5, h6 {
            color: #24292e;
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }
        h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
        h3 { font-size: 1.25em; }
        ul {
            list-style-type: disc;
            margin-left: 20px;
            padding-left: 0;
        }
        ol {
            list-style-type: decimal;
            margin-left: 20px;
            padding-left: 0;
        }
        li {
            margin-bottom: 0.5em;
        }
        a {
            color: #0366d6;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
        code {
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
            background-color: rgba(27,31,35,.05);
            border-radius: 3px;
            padding: 0.2em 0.4em;
            font-size: 85%;
            color: #333;
        }
        pre {
            background-color: #f6f8fa;
            border-radius: 3px;
            padding: 16px;
            overflow: auto;
            font-size: 85%;
            line-height: 1.45;
            margin-bottom: 1.5em;
            border: 1px solid #eaecef;
        }
        pre code {
            background-color: transparent;
            padding: 0;
        }
        blockquote {
            background-color: #f9f9f9;
            border-left: 4px solid #ccc;
            margin: 1.5em 0;
            padding: 0.5em 20px;
            color: #666;
        }
        /* Optional: Emoji styling if needed */
        .emoji {
            font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", sans-serif;
        }
    </style>
</head>
<body>

    <h1><span class="emoji">🎫</span> Ticket System Frontend</h1>

    <p>A modern, responsive frontend application for a simple ticket management system, built with React and TypeScript. This application allows users to register, log in, create new tickets, and view their submitted tickets.</p>

    <h2><span class="emoji">✨</span> Features</h2>

    <ul>
        <li><strong>User Authentication:</strong>
            <ul>
                <li>User Registration</li>
                <li>User Login</li>
                <li>User Logout</li>
                <li>Authentication state persisted across sessions (using <code>localStorage</code>).</li>
            </ul>
        </li>
        <li><strong>Protected Routes:</strong> Ensures only authenticated users can access the Dashboard and other protected content.</li>
        <li><strong>Ticket Management:</strong>
            <ul>
                <li>Submit new support tickets.</li>
                <li>View a list of all submitted tickets on the dashboard.</li>
                <li>Dynamic links to individual ticket details (future feature, link structure in place).</li>
            </ul>
        </li>
        <li><strong>Intuitive UI/UX:</strong>
            <ul>
                <li>Dynamic Navbar reflecting authentication status.</li>
                <li>Form validation (<code>required</code> fields).</li>
                <li>Loading indicators during API calls.</li>
                <li>User-friendly error messages for API failures.</li>
            </ul>
        </li>
        <li><strong>Modern Frontend Stack:</strong> Built with Vite for a fast development experience.</li>
    </ul>

    <h2><span class="emoji">🚀</span> Technologies Used</h2>

    <ul>
        <li><strong>React:</strong> Frontend JavaScript library for building user interfaces.</li>
        <li><strong>TypeScript:</strong> Superset of JavaScript for type-safe code.</li>
        <li><strong>React Router DOM:</strong> For client-side routing.</li>
        <li><strong>Axios:</strong> Promise-based HTTP client for API requests.</li>
        <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development.</li>
        <li><strong>Vite:</strong> Next-generation frontend tooling for a blazing fast development experience.</li>
        <li><strong>Context API:</strong> For global state management (Authentication Context).</li>
    </ul>

    <h2><span class="emoji">📋</span> Prerequisites</h2>

    <p>Before you begin, ensure you have the following installed on your machine:</p>

    <ul>
        <li><a href="https://nodejs.org/en/">Node.js</a> (LTS version recommended)</li>
        <li>npm or Yarn (package manager)</li>
    </ul>

    <h2><span class="emoji">🛠️</span> Getting Started</h2>

    <p>Follow these steps to get the project up and running on your local machine.</p>

    <h3>1. Clone the repository</h3>

    <pre><code>git clone &lt;your-repository-url&gt;
cd &lt;your-project-folder&gt; # e.g., cd ticket-system-frontend</code></pre>

    <h3>2. Install Dependencies</h3>

    <p>Using npm:</p>

    <pre><code>npm install</code></pre>

    <p>Or using Yarn:</p>

    <pre><code>yarn install</code></pre>

    <h3>3. Environment Variables</h3>

    <p>Create a <code>.env.development</code> file in the root of your project (<code>client/</code> folder if it's within a monorepo) and add your backend API base URL:</p>

    <pre><code># .env.development
VITE_API_BASE_URL=http://localhost:5000/api</code></pre>

    <blockquote>
        <p><strong>Note:</strong> For production deployment, you would create a <code>.env.production</code> file with your production backend API URL (e.g., <code>https://your-production-backend.com/api</code>).</p>
    </blockquote>

    <h3>4. Run the Development Server</h3>

    <p>Using npm:</p>

    <pre><code>npm run dev</code></pre>

    <p>Or using Yarn:</p>

    <pre><code>yarn dev</code></pre>

    <p>The application will typically be accessible at <code>http://localhost:5173</code> (or another port if 5173 is in use).</p>

    <h3>5. Backend Integration</h3>

    <p>This frontend application requires a corresponding backend API to function correctly. Ensure your backend is running and accessible at the <code>VITE_API_BASE_URL</code> you configured.</p>

    <p>Expected backend endpoints:</p>

    <ul>
        <li><code>POST /api/auth/register</code></li>
        <li><code>POST /api/auth/login</code></li>
        <li><code>POST /api/tickets</code></li>
        <li><code>GET /api/tickets</code></li>
        <li><code>GET /api/tickets/:id</code> (for future ticket detail pages)</li>
    </ul>

    <h2><span class="emoji">📁</span> Project Structure (Key Files)</h2>

    <ul>
        <li><code>src/App.tsx</code>: Main application component, handles routing.</li>
        <li><code>src/api/axios.ts</code>: Centralized Axios instance for API calls.</li>
        <li><code>src/context/AuthContext.tsx</code>: React Context for managing user authentication state.</li>
        <li><code>src/components/Navbar.tsx</code>: Navigation bar with conditional links.</li>
        <li><code>src/components/ProtectedRoute.tsx</code>: Component to protect routes based on authentication.</li>
        <li><code>src/pages/RegisterPage.tsx</code>: User registration form.</li>
        <li><code>src/pages/LoginPage.tsx</code>: User login form.</li>
        <li><code>src/pages/NewTicketPage.tsx</code>: Form for creating new tickets.</li>
        <li><code>src/pages/Dashboard.tsx</code>: Displays a list of user's tickets.</li>
    </ul>

</body>
</html>