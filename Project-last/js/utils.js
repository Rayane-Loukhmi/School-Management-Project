function initializeLocalStorage() {
    if (!localStorage.getItem('users')) {
        const users = [
            { id: 1, role: 'admin', name: 'Admin User', email: 'admin@school.com', password: 'admin123', groups: [] },
            { id: 2, role: 'teacher', name: 'Teacher 1', email: 'teacher1@school.com', password: 'teacher123', groups: [] },
            { id: 3, role: 'student', name: 'Student 1', email: 'student1@school.com', password: 'student123', groups: [] }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }

    if (!localStorage.getItem('courses')) {
        const courses = [
            { id: 1, name: 'Math', teacherId: 2 },
            { id: 2, name: 'Science', teacherId: 2 }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }

    if (!localStorage.getItem('grades')) {
        const grades = [
            { studentId: 3, courseId: 1, grade: 'A' },
            { studentId: 3, courseId: 2, grade: 'B' }
        ];
        localStorage.setItem('grades', JSON.stringify(grades));
    }

    if (!localStorage.getItem('groups')) {
        const groups = [
            { id: 1, name: 'Group A' },
            { id: 2, name: 'Group B' }
        ];
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    // Initialize notifications if not already present
    if (!localStorage.getItem('notifications')) {
        localStorage.setItem('notifications', JSON.stringify([]));
    }
}

function toggleTheme() {
    const body = document.body;
    body.classList.toggle('bg-gray-900');
    body.classList.toggle('text-white');
}

// Toggle between light and dark themes
function toggleTheme() {
    const htmlElement = document.documentElement;

    // Check if the current theme is dark
    const isDarkMode = htmlElement.classList.contains('dark');

    // Remove both classes first
    htmlElement.classList.remove('light', 'dark');

    // Add the new theme class
    if (isDarkMode) {
        htmlElement.classList.add('light');
    } else {
        htmlElement.classList.add('dark');
    }

    // Save the user's theme preference in localStorage
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');

    console.log('Theme toggled:', isDarkMode ? 'Light' : 'Dark'); // Debugging
    console.log('HTML class list:', htmlElement.classList); // Debugging
}

// Apply the saved theme on page load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const htmlElement = document.documentElement;

    // Remove both classes first
    htmlElement.classList.remove('light', 'dark');

    // Add the saved theme class
    htmlElement.classList.add(savedTheme);

    console.log('Applied theme:', savedTheme); // Debugging
}

// Call this function when the page loads
applySavedTheme();

window.initializeLocalStorage = initializeLocalStorage;