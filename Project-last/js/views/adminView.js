// js/views/adminView.js

function renderAdminView() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <!-- Top Navigation (Sidebar) -->
            <div class="bg-black text-white p-4 shadow-lg">
                <div class="container mx-auto flex justify-between items-center">
                    <h4 class="text-xl font-bold">Admin Dashboard</h4>
                    <nav>
                        <ul class="flex space-x-4">
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageUsers()">Manage Users</button></li>
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageCourses()">Manage Courses</button></li>
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderGroupManagement()">Manage Groups</button></li>
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderAdminAnalytics()">Analytics</button></li>
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderNotifications()">Notifications</button></li>
                            <li><button class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="exportDataToPDF()">Export Data as PDF</button></li>
                            <li><button class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="toggleTheme()">Toggle Theme</button></li>
                            <li><button id="logoutButton" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all">Logout</button></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="container mx-auto p-8">
                <div id="adminContent" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome, Admin!</h1>
                    <p class="text-gray-600 dark:text-gray-300">Select an option from the sidebar to get started.</p>
                </div>
            </div>
        </div>
    `;

    // Attach the event listener after the button is rendered
    document.getElementById('logoutButton').addEventListener('click', function() {
        // Redirect to index.html
        window.location.href = 'index.html';
    });
}