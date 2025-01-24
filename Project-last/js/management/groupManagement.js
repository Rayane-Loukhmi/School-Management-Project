// Render the "Manage Groups" view
function renderGroupManagement() {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Groups</h2>
        <button class="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-700 transition duration-300" onclick="renderAddGroupForm()">Add Group</button>
        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="p-3 text-left">ID</th>
                    <th class="p-3 text-left">Name</th>
                    <th class="p-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody id="groupTableBody">
                ${groups.map(group => `
                    <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="p-3 dark:text-white">${group.id}</td>
                        <td class="p-3 dark:text-white">${group.name}</td>
                        <td class="p-3">
                            <button class="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderEditGroupForm(${group.id})">Edit</button>
                            <button class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300" onclick="deleteGroup(${group.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render the "Add Group" form
function renderAddGroupForm() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Group</h1>
        <form onsubmit="handleAddGroup(event)" class="space-y-4">
            <div>
                <input type="text" id="groupName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Group Name" required>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Add Group</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderGroupManagement()">Cancel</button>
        </form>
    `;
}

// Render the "Edit Group" form
function renderEditGroupForm(groupId) {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const group = groups.find(g => g.id === groupId);

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Group</h1>
        <form onsubmit="handleEditGroup(event, ${groupId})" class="space-y-4">
            <div>
                <input type="text" id="groupName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value="${group.name}" required>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Save Changes</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderGroupManagement()">Cancel</button>
        </form>
    `;
}

// Handle adding a new group
function handleAddGroup(event) {
    event.preventDefault();

    const groupName = document.getElementById('groupName').value;

    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    // Find the maximum ID in the existing groups
    const maxId = groups.reduce((max, group) => (group.id > max ? group.id : max), 0);

    // Create a new group with an incremented ID
    const newGroup = {
        id: maxId + 1, // Increment from the last ID
        name: groupName,
    };

    groups.push(newGroup);
    localStorage.setItem('groups', JSON.stringify(groups));

    // Add notification
    addNotification(`New group added: ${groupName}`);

    alert('Group added successfully!');
    renderGroupManagement();
}

// Handle editing a group
function handleEditGroup(event, groupId) {
    event.preventDefault();

    const newName = document.getElementById('groupName').value;

    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const groupIndex = groups.findIndex(g => g.id === groupId);

    if (groupIndex === -1) {
        alert('Group not found!');
        return;
    }

    const oldGroup = groups[groupIndex]; // Get the old group data
    const oldName = oldGroup.name; // Old group name

    // Update the group with the new name
    groups[groupIndex] = { ...oldGroup, name: newName };
    localStorage.setItem('groups', JSON.stringify(groups));

    // Add notification with old and new values
    addNotification(`Group edited: Old Name: ${oldName}, New Name: ${newName}`);

    alert('Group updated successfully!');
    renderGroupManagement(); // Re-render the group management view
}

function deleteGroup(groupId) {
    if (confirm("Are you sure you want to delete this group?")) {
        const groups = JSON.parse(localStorage.getItem('groups')) || [];

        // Find the group to be deleted
        const groupToDelete = groups.find(g => g.id === groupId);

        if (!groupToDelete) {
            alert('Group not found!');
            return;
        }

        const groupName = groupToDelete.name; // Get the group's name

        // Remove the group with the specified ID
        const updatedGroups = groups.filter(g => g.id !== groupId);
        localStorage.setItem('groups', JSON.stringify(updatedGroups));

        // Add notification with the group's name
        addNotification(`Group deleted: ${groupName}`);

        alert('Group deleted successfully!');
        renderGroupManagement(); // Re-render the group management view
    }
}

function countStudentsPerGroup() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    // Count students per group
    const groupCounts = groups.reduce((acc, group) => {
        const studentsInGroup = users.filter(user => user.role === 'student' && user.groups.includes(group.id));
        acc[group.name] = studentsInGroup.length;
        return acc;
    }, {});

    return groupCounts;
}