<h1><span class="emoji">🎫</span> Ticket System Frontend</h1>
<p>A modern, responsive frontend application for a simple ticket management system, built with React and TypeScript. This application allows users to register, log in, create new tickets, and view their submitted tickets.</p>

<h2><span>✨</span> Features</h2>
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

<h2><span>🚀</span> Technologies Used</h2>
<ul>
    <li><strong>React:</strong> Frontend JavaScript library for building user interfaces.</li>
    <li><strong>TypeScript:</strong> Superset of JavaScript for type-safe code.</li>
    <li><strong>React Router DOM:</strong> For client-side routing.</li>
    <li><strong>Axios:</strong> Promise-based HTTP client for API requests.</li>
    <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid UI development.</li>
    <li><strong>Vite:</strong> Next-generation frontend tooling for a blazing fast development experience.</li>
    <li><strong>Context API:</strong> For global state management (Authentication Context).</li>
</ul>

<h2><span>📋</span> Prerequisites</h2>
<p>Before you begin, ensure you have the following installed on your machine:</p>

<ul>
    <li><a href="https://nodejs.org/en/">Node.js</a> (LTS version recommended)</li>
    <li>npm or Yarn (package manager)</li>
    <li>MongoDB (if your backend uses it, e.g., for a MERN stack)</li>
</ul>

<h2><span>🛠️</span> Getting Started</h2>
<p>Follow these steps to get the project up and running on your local machine.</p>

<h3>1. Clone the repository</h3>
<p>Clone the main project repository that contains both <code>client</code> and <code>server</code> folders:</p>

<pre><code>git clone &lt;your-repository-url&gt;
cd &lt;your-project-folder&gt; # e.g., cd ticket-system-fullstack</code></pre>

<h3>2. Frontend Setup (Client)</h3>
<p>Navigate into the <code>client</code> directory to set up the frontend application:</p>
<pre><code>cd client</code></pre>

<h4>2.1. Install Frontend Dependencies</h4>
<p>Using npm:</p>
<pre><code>npm install</code></pre>

<p>Or using Yarn:</p>
<pre><code>yarn install</code></pre>

<h4>2.2. Environment Variables (Frontend)</h4>
<p>Create a <code>.env.development</code> file in the root of your frontend project (i.e., inside the <code>client/</code> folder) and add your backend API base URL:</p>
<pre><code># client/.env.development
VITE_API_BASE_URL=http://localhost:5000/api</code></pre>

<blockquote>
    <p><strong>Note:</strong> For production deployment, you would create a <code>.env.production</code> file with your production backend API URL (e.g., <code>https://your-production-backend.com/api</code>).</p>
</blockquote>

<h4>2.3. Run the Frontend Development Server</h4>
<p>From within the <code>client/</code> directory, run the development server:</p>
<pre><code>npm run dev</code></pre>

<p>Or using Yarn:</p>
<pre><code>yarn dev</code></pre>

<p>The frontend application will typically be accessible at <code>http://localhost:5173</code> (or another port if 5173 is in use).</p>

<h3>3. Backend Setup (Server)</h3>
<p>Open a new terminal window or tab, and navigate into the <code>server</code> directory to set up the backend API:</p>
<pre><code>cd ../server</code></pre>

<h4>3.1. Install Backend Dependencies</h4>
<p>From within the <code>server/</code> directory, install its dependencies (e.g., for a Node.js project):</p>
<pre><code>npm install
# or yarn install</code></pre>

<h4>3.2. Environment Variables (Backend)</h4>
<p>Create a <code>.env</code> file in the root of your backend project (i.e., inside the <code>server/</code> folder) and configure the necessary environment variables, such as the port, database connection string, and JWT secret. Adjust these according to your backend's specific requirements.</p>

<pre><code># server/.env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ticketdb
JWT_SECRET=your_jwt_secret_key_here
</code></pre>

<h4>3.3. Run the Backend Server</h4>
<p>From within the <code>server/</code> directory, start the server. This command may vary based on your backend framework (e.g., for a Node.js/Express app):</p>

<pre><code>npm start
# or node server.js
# or npm run dev (if you have a dev script with nodemon)
</code></pre>
<p>Ensure the backend is running on the port configured in its <code>.env</code> file (e.g., <code>5000</code>), as this needs to match the port used in your frontend's <code>VITE_API_BASE_URL</code>.</p>

<h2><span>📁</span> Project Structure (Key Files)</h2>
<h3>Overall Repository Structure</h3>
<ul>
    <li><code>client/</code>: Contains all frontend application code.</li>
    <li><code>server/</code>: Contains all backend API code.</li>
</ul>

<h3>Frontend Structure (<code>client/</code>)</h3>
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

<h3>Backend Structure (<code>server/</code> - Example)</h3>
<p>This is a hypothetical example; your actual backend structure may differ.</p>
<ul>
    <li><code>server.js</code> or <code>app.js</code>: Main entry point.</li>
    <li><code>routes/</code>: Defines API endpoints (e.g., <code>authRoutes.js</code>, <code>ticketRoutes.js</code>).</li>
    <li><code>models/</code>: Defines database schemas (e.g., <code>User.js</code>, <code>Ticket.js</code>).</li>
    <li><code>config/</code>: Database connection setup.</li>
    <li><code>middleware/</code>: Authentication middleware (e.g., <code>authMiddleware.js</code>).</li>
</ul>