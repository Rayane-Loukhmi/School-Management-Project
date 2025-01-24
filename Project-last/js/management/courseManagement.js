// Course Management Functions

// Render the "Manage Courses" view
function renderManageCourses() {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Sort courses by ID in ascending order
    const sortedCourses = courses.sort((a, b) => a.id - b.id);

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Manage Courses</h2>
        <button class="bg-gray-800 text-white px-4 py-2 rounded-lg mb-6 hover:bg-gray-700 transition duration-300" onclick="renderAddCourseForm()">Add Course</button>
        <table class="w-full border-collapse">
            <thead>
                <tr class="bg-gray-800 text-white">
                    <th class="p-3 text-left">ID</th>
                    <th class="p-3 text-left">Name</th>
                    <th class="p-3 text-left">Teacher ID</th>
                    <th class="p-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${sortedCourses.map(course => `
                    <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="p-3 dark:text-white">${course.id}</td>
                        <td class="p-3 dark:text-white">${course.name}</td>
                        <td class="p-3 dark:text-white">${course.teacherId}</td>
                        <td class="p-3">
                            <button class="bg-gray-800 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderEditCourseForm(${course.id})">Edit</button>
                            <button class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300" onclick="deleteCourse(${course.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render the "Add Course" form
function renderAddCourseForm() {
    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Add Course</h1>
        <form onsubmit="handleAddCourse(event)" class="space-y-4">
            <div>
                <input type="text" id="courseName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Course Name" required>
            </div>
            <div>
                <input type="number" id="teacherId" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" placeholder="Teacher ID" required>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Add Course</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageCourses()">Cancel</button>
        </form>
    `;
}

// Render the "Edit Course" form
function renderEditCourseForm(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses.find(c => c.id === courseId);

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Course</h1>
        <form onsubmit="handleEditCourse(event, ${courseId})" class="space-y-4">
            <div>
                <input type="text" id="courseName" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value="${course.name}" required>
            </div>
            <div>
                <input type="number" id="teacherId" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white" value="${course.teacherId}" required>
            </div>
            <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300">Save Changes</button>
            <button type="button" class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300" onclick="renderManageCourses()">Cancel</button>
        </form>
    `;
}

// Handle adding a new course
function handleAddCourse(event) {
    event.preventDefault();

    const name = document.getElementById('courseName').value;
    const teacherId = parseInt(document.getElementById('teacherId').value);

    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Calculate the next ID
    const nextId = courses.length > 0 ? courses.length + 1 : 1;

    // Create the new course object
    const newCourse = { id: nextId, name, teacherId };

    // Add the new course to the list
    courses.push(newCourse);

    // Save the updated courses list to localStorage
    localStorage.setItem('courses', JSON.stringify(courses));

    // Add notification
    addNotification(`New course added: ${name} , teacher assigned : ${teacherId}`);

    alert('Course added successfully!');
    renderManageCourses();
}

// Handle editing a course
function handleEditCourse(event, courseId) {
    event.preventDefault();

    const newName = document.getElementById('courseName').value;
    const newTeacherId = parseInt(document.getElementById('teacherId').value);

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const courseIndex = courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
        alert('Course not found!');
        return;
    }

    const oldCourse = courses[courseIndex]; // Get the old course data
    const oldName = oldCourse.name; // Old course name
    const oldTeacherId = oldCourse.teacherId; // Old teacher ID

    // Update the course with new values
    courses[courseIndex] = { ...oldCourse, name: newName, teacherId: newTeacherId };
    localStorage.setItem('courses', JSON.stringify(courses));

    // Add notification with old and new values
    addNotification(
        `Course edited: 
        Old Name: ${oldName}, New Name: ${newName}, 
        Old Teacher ID: ${oldTeacherId}, New Teacher ID: ${newTeacherId}`
    );

    alert('Course updated successfully!');
    renderManageCourses(); // Re-render the course management view
}

// Handle deleting a course
function deleteCourse(courseId) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Find the course to be deleted
    const courseToDelete = courses.find(c => c.id === courseId);

    if (!courseToDelete) {
        alert('Course not found!');
        return;
    }

    const courseName = courseToDelete.name; // Get the course's name

    // Remove the course with the specified ID
    const updatedCourses = courses.filter(c => c.id !== courseId);

    // Reorder the IDs
    updatedCourses.forEach((course, index) => {
        course.id = index + 1; // Reassign IDs starting from 1
    });

    // Save the updated courses list to localStorage
    localStorage.setItem('courses', JSON.stringify(updatedCourses));

    // Add notification with the course's name
    addNotification(`Course deleted: ${courseName}`);

    alert('Course deleted successfully!');
    renderManageCourses(); // Re-render the course management view
}