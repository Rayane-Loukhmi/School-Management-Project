// User Management Functions

// Render the "Manage Users" view
function renderManageUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Users</h2>
        <div class="mb-6">
            <input type="text" id="userSearch" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Search users..." oninput="filterUsers()">
        </div>
        <button class="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-700 transition duration-300" onclick="renderAddUserForm()">Add User</button>
        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="p-3 text-left">ID</th>
                    <th class="p-3 text-left">Name</th>
                    <th class="p-3 text-left">Email</th>
                    <th class="p-3 text-left">Role</th>
                    <th class="p-3 text-left">Password</th>
                    <th class="p-3 text-left">Group(s)</th>
                    <th class="p-3 text-left">Gender</th>
                    <th class="p-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody id="userTableBody">
                ${users.map(user => {
                    // Map group IDs to group names
                    const groupNames = user.groups
                        ? user.groups
                              .map(groupId => {
                                  const group = groups.find(g => g.id === groupId);
                                  return group ? group.name : 'Unknown Group';
                              })
                              .join(', ')
                        : 'None';

                    return `
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="p-3 dark:text-white">${user.id}</td>
                            <td class="p-3 dark:text-white">${user.name}</td>
                            <td class="p-3 dark:text-white">${user.email}</td>
                            <td class="p-3 dark:text-white">${user.role}</td>
                            <td class="p-3 dark:text-white">${user.password}</td>
                            <td class="p-3 dark:text-white">${groupNames}</td>
                            <td class="p-3 dark:text-white">${user.gender}</td>
                            <td class="p-3">
                                <button class="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderEditUserForm(${user.id})">Edit</button>
                                <button class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300" onclick="deleteUser(${user.id})">Delete</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

// Render the "Add User" form
function renderAddUserForm() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add User</h1>
        <form onsubmit="handleAddUser(event)" class="space-y-4">
            <div>
                <input type="text" id="userName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Name" required>
            </div>
            <div>
                <input type="email" id="userEmail" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Email" required>
            </div>
            <div>
                <input type="password" id="userPassword" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Password" required>
            </div>
            <div>
                <label for="userGender" class="block text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select id="userGender" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>
            <div>
                <label for="userGroups" class="block text-gray-700 dark:text-gray-300 mb-2">Groups</label>
                <select id="userGroups" multiple class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    ${groups.map(group => `
                        <option value="${group.id}">${group.name}</option>
                    `).join('')}
                </select>
            </div>
            <div>
                <select id="userRole" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                </select>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Add User</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageUsers()">Cancel</button>
        </form>
    `;
}

// Render the "Edit User" form
function renderEditUserForm(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const user = users.find(u => u.id === userId);

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit User</h1>
        <form onsubmit="handleEditUser(event, ${userId})" class="space-y-4">
            <div>
                <input type="text" id="userName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value="${user.name}" required>
            </div>
            <div>
                <input type="email" id="userEmail" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value="${user.email}" required>
            </div>
            <div>
                <input type="password" id="userPassword" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="New Password" required>
            </div>
            <div>
                <label for="userGender" class="block text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <select id="userGender" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required>
                    <option value="">Select Gender</option>
                    <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Male</option>
                    <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Female</option>
                </select>
            </div>
            <div>
                <select id="userRole" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" required>
                    <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    <option value="teacher" ${user.role === 'teacher' ? 'selected' : ''}>Teacher</option>
                    <option value="student" ${user.role === 'student' ? 'selected' : ''}>Student</option>
                </select>
            </div>
            <div>
                <label for="userGroups" class="block text-gray-700 dark:text-gray-300 mb-2">Groups</label>
                <select id="userGroups" multiple class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
                    ${groups.map(group => `
                        <option value="${group.id}" ${user.groups && user.groups.includes(group.id) ? 'selected' : ''}>${group.name}</option>
                    `).join('')}
                </select>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Save Changes</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageUsers()">Cancel</button>
        </form>
    `;
}

// Handle adding a new user
function handleAddUser(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const gender = document.getElementById('userGender').value; // Get gender
    const groupIds = Array.from(document.getElementById('userGroups').selectedOptions).map(option => Number(option.value));

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const nextId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const newUser = { id: nextId, name, email, password, role, gender, groups: groupIds || [] }; // Ensure groups is an array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Fetch group names from localStorage
    const allGroups = JSON.parse(localStorage.getItem('groups')) || [];
    const groupNames = groupIds.map(id => {
        const group = allGroups.find(g => g.id === id);
        return group ? group.name : 'Unknown Group'; // Fallback for invalid group IDs
    });

    // Add notification
    addNotification(
        `New user registered: ${name}, email: ${email}, role: ${role}, groups: ${groupNames.join(', ')}`
    );

    alert('User added successfully!');
    renderManageUsers();
}

// Handle editing a user
function handleEditUser(event, userId) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const gender = document.getElementById('userGender').value; // Get gender
    const groupIds = Array.from(document.getElementById('userGroups').selectedOptions).map(option => Number(option.value));

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        alert('User not found!');
        return;
    }

    const oldUser = users[userIndex]; // Get the old user data
    const oldName = oldUser.name; // Old user name
    const oldEmail = oldUser.email; // Old email
    const oldRole = oldUser.role; // Old role
    const oldGroupIds = oldUser.groups || []; // Old group IDs

    // Update the user with new values
    users[userIndex] = { ...oldUser, name, email, password, role, gender, groups: groupIds || [] };
    localStorage.setItem('users', JSON.stringify(users));

    // Fetch group names from localStorage
    const allGroups = JSON.parse(localStorage.getItem('groups')) || [];

    // Map old group IDs to group names
    const oldGroupNames = oldGroupIds.map(id => {
        const group = allGroups.find(g => g.id === id);
        return group ? group.name : 'Unknown Group'; // Fallback for invalid group IDs
    });

    // Map new group IDs to group names
    const newGroupNames = groupIds.map(id => {
        const group = allGroups.find(g => g.id === id);
        return group ? group.name : 'Unknown Group'; // Fallback for invalid group IDs
    });

    // Add notification with old and new values
    addNotification(
        `User updated: 
        Old Name: ${oldName}, New Name: ${name}, 
        Old Email: ${oldEmail}, New Email: ${email}, 
        Old Role: ${oldRole}, New Role: ${role}, 
        Old Groups: ${oldGroupNames.join(', ')}, New Groups: ${newGroupNames.join(', ')}`
    );

    alert('User updated successfully!');
    renderManageUsers(); // Re-render the user management view
}

// Handle deleting a user
function deleteUser(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find the user to be deleted
    const userToDelete = users.find(u => u.id === userId);

    if (!userToDelete) {
        alert('User not found!');
        return;
    }

    const userName = userToDelete.name; // Get the user's name

    // Filter out the user to delete
    const updatedUsers = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Add a notification with the user's name
    addNotification(`User deleted: ${userName}`);

    alert('User deleted successfully!');
    renderManageUsers(); // Re-render the user management view
}

// Filter users based on search input
function filterUsers() {
    const searchTerm = document.getElementById('userSearch').value.toLowerCase();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    const filteredUsers = users.filter(user => {
        // Map group IDs to group names
        const groupNames = user.groups
            ? user.groups
                  .map(groupId => {
                      const group = groups.find(g => g.id === groupId);
                      return group ? group.name : 'Unknown Group';
                  })
                  .join(', ')
            : 'None';

        // Check if the search term matches any of the user's fields or group names
        return (
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm) ||
            groupNames.toLowerCase().includes(searchTerm) // Include group names in the search
        );
    });

    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = filteredUsers.map(user => {
        // Map group IDs to group names for display
        const groupNames = user.groups
            ? user.groups
                  .map(groupId => {
                      const group = groups.find(g => g.id === groupId);
                      return group ? group.name : 'Unknown Group';
                  })
                  .join(', ')
            : 'None';

        return `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
                <td class="p-3">${user.id}</td>
                <td class="p-3">${user.name}</td>
                <td class="p-3">${user.email}</td>
                <td class="p-3">${user.role}</td>
                <td class="p-3">${user.password}</td>
                <td class="p-3">${groupNames}</td>
                <td class="p-3">
                    <button class="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderEditUserForm(${user.id})">Edit</button>
                    <button class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}