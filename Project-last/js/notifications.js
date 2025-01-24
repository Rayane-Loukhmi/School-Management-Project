// Notifications Functions

function clearNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        saveNotifications([]); // Clear notifications
        renderNotifications(); // Re-render the notifications view
    }
}

// Render the "Notifications" view
function renderNotifications() {
    const notifications = getNotifications(); // Fetch notifications from localStorage

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Notifications</h2>
        <button class="bg-red-600 text-white px-4 py-2 rounded-lg mb-6 hover:bg-red-700 transition duration-300" onclick="clearNotifications()">
            Clear Notifications
        </button>
        <ul class="space-y-4">
            ${notifications.map(notification => `
                <li class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-700 dark:text-gray-300">${notification.message}</span>
                        <small class="text-gray-500 dark:text-gray-400">${notification.date}</small>
                    </div>
                </li>
            `).join('')}
        </ul>
    `;
}

// Helper function to get notifications from localStorage
function getNotifications() {
    try {
        return JSON.parse(localStorage.getItem('notifications')) || [];
    } catch (error) {
        console.error('Error loading notifications:', error);
        return [];
    }
}

// Helper function to save notifications to localStorage
function saveNotifications(notifications) {
    try {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
}

// Add a new notification
function addNotification(message) {
    const notifications = getNotifications();

    // Get the current date and time
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const time = now.toLocaleTimeString(); // Current time in HH:MM:SS format

    const newNotification = {
        id: notifications.length + 1, // Auto-increment ID
        message: message,
        date: `${date} ${time}`, // Combine date and time
    };

    notifications.push(newNotification);
    saveNotifications(notifications);
}