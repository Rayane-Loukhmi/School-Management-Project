// teacherView.js
function renderTeacherView(showLogoutButton = true) {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <!-- Sidebar -->
            <div class="w-64 bg-blue-800 dark:bg-blue-900 text-white p-6">
                <!-- Logo and Teacher Dashboard Heading -->
                <div class="flex items-center mb-6">
                    <img src="images/logo.png" alt="Logo" class="w-20 h-20 mr-3"> <!-- Even Bigger Logo -->
                    <h4 class="text-xl font-bold">Teacher Dashboard</h4>
                </div>
                <hr class="mb-4 border-gray-700">
                <button class="w-full bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded mb-3 hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300" onclick="renderStudentGradesView()">View Grades</button>
                <button class="w-full bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded mb-3 hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300" onclick="renderAssignGradeForm()">Assign Grade</button>
                <!-- Export PDF Button -->
                <button class="w-full bg-green-500 text-white px-4 py-2 rounded mb-3 hover:bg-green-600 transition duration-300" onclick="renderExportGradesView_Teacher()">Export Grades as PDF</button>
                <!-- Dark Mode Toggle Button -->
                <button id="darkModeToggle" class="w-full bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded mb-3 hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300">
                    Toggle Dark Mode
                </button>
                ${showLogoutButton ? `
                    <!-- Logout Button -->
                    <button id="logoutButton" class="w-full bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded mb-3 hover:bg-red-700 dark:hover:bg-red-800 transition duration-300">Logout</button>
                ` : ''}
            </div>
            <!-- Main Content -->
            <div class="flex-grow p-8 bg-white dark:bg-gray-800">
                <h1 class="text-2xl font-bold text-gray-800 dark:text-white mb-6">Welcome, Teacher!</h1>
                <p class="text-gray-600 dark:text-gray-300">Select an option from the sidebar to get started.</p>
            </div>
        </div>
    `;

    // Event delegation for dark mode toggle
    app.addEventListener('click', function (event) {
        if (event.target.id === 'darkModeToggle') {
            const isDarkMode = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
    });

    // Event delegation for logout button
    if (showLogoutButton) {
        document.getElementById('logoutButton').addEventListener('click', function () {
            // Redirect to index.html
            window.location.href = 'index.html';
        });
    }
}

function renderStudentGradesView() {
    const app = document.getElementById('app');
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    app.innerHTML = `
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <!-- Top Navigation -->
            <div class="bg-blue-800 dark:bg-blue-900 text-white p-4 shadow-lg">
                <div class="container mx-auto flex justify-between items-center">
                    <h4 class="text-xl font-bold">Teacher Dashboard</h4>
                    <nav>
                        <ul class="flex space-x-4">
                            <li><button class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300" onclick="renderTeacherView()">Back to Dashboard</button></li>
                            <li><button id="logoutButton" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all">Logout</button></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="container mx-auto p-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">View Student Grades</h1>

                    <!-- Group Selector -->
                    <div class="mb-6">
                        <label for="groupSelector" class="block text-gray-700 dark:text-gray-300 mb-2">Select Group:</label>
                        <select id="groupSelector" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dark:bg-gray-700 dark:text-white">
                            <option value="">Select a group</option>
                            ${groups.map(group => `
                                <option value="${group.id}">${group.name}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Grades Table -->
                    <div id="gradesTableContainer" class="mt-6">
                        <p class="text-gray-600 dark:text-gray-300">Please select a group to view student grades.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach event listener for group selector
    document.getElementById('groupSelector').addEventListener('change', function () {
        const selectedGroupId = this.value;
        if (selectedGroupId) {
            renderGradesTable(selectedGroupId);
        } else {
            document.getElementById('gradesTableContainer').innerHTML = '<p class="text-gray-600 dark:text-gray-300">Please select a group to view student grades.</p>';
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        // Redirect to index.html
        window.location.href = 'index.html';
    });
}

function renderGradesTable(groupId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Filter students in the selected group
    const studentsInGroup = users.filter(user => user.role === 'student' && user.groups.includes(parseInt(groupId)));

    // Filter grades for students in the selected group
    const groupGrades = grades.filter(grade => studentsInGroup.some(student => student.id === grade.studentId));

    // Organize grades by student and course
    const gradesByStudent = studentsInGroup.map(student => {
        const studentGrades = groupGrades.filter(grade => grade.studentId === student.id);
        return {
            student,
            grades: studentGrades.map(grade => {
                const course = courses.find(course => course.id === grade.courseId);
                return {
                    course: course ? course.name : 'Unknown Course',
                    grade: grade.grade
                };
            })
        };
    });

    // Render the table
    const gradesTableContainer = document.getElementById('gradesTableContainer');
    if (studentsInGroup.length === 0) {
        gradesTableContainer.innerHTML = '<p class="text-gray-600 dark:text-gray-300">No students found in the selected group.</p>';
        return;
    }

    gradesTableContainer.innerHTML = `
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Grades for Selected Group</h3>

        <!-- Course Selector -->
        <div class="mb-6">
            <label for="courseSelector" class="block text-gray-700 dark:text-gray-300 mb-2">Select Course:</label>
            <select id="courseSelector" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dark:bg-gray-700 dark:text-white">
                <option value="">Select a course</option>
                ${courses.map(course => `
                    <option value="${course.id}">${course.name}</option>
                `).join('')}
            </select>
        </div>

        <!-- Grades Table -->
        <table class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
            <thead class="bg-blue-600 dark:bg-blue-700 text-white">
                <tr>
                    <th class="p-3 text-left">Student Name</th>
                    ${courses.map(course => `
                        <th class="p-3 text-left">${course.name}</th>
                    `).join('')}
                </tr>
            </thead>
            <tbody>
                ${gradesByStudent.map(studentData => `
                    <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td class="p-3 text-gray-900 dark:text-white">${studentData.student.name}</td>
                        ${courses.map(course => {
                            const grade = studentData.grades.find(g => g.course === course.name);
                            return `
                                <td class="p-3 text-gray-900 dark:text-white">${grade ? grade.grade : 'N/A'}</td>
                            `;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Chart Container -->
        <div class="mt-8">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Grade Distribution</h3>
            <canvas id="gradesChart" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"></canvas>
        </div>
    `;

    // Attach event listener for course selector
    document.getElementById('courseSelector').addEventListener('change', function () {
        const selectedCourseId = this.value;
        if (selectedCourseId) {
            renderGradesChart(groupId, selectedCourseId);
        } else {
            const chartCanvas = document.getElementById('gradesChart');
            if (chartCanvas) {
                chartCanvas.innerHTML = ''; // Clear the chart if no course is selected
            }
        }
    });
}

function renderGradesChart(groupId, courseId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];

    // Filter students in the selected group
    const studentsInGroup = users.filter(user => user.role === 'student' && user.groups.includes(parseInt(groupId)));

    // Filter grades for students in the selected group and course
    const courseGrades = grades.filter(grade => 
        studentsInGroup.some(student => student.id === grade.studentId) && 
        grade.courseId === parseInt(courseId)
    );

    // Count the number of students for each grade
    const gradeCounts = {};
    courseGrades.forEach(grade => {
        if (!gradeCounts[grade.grade]) {
            gradeCounts[grade.grade] = 0;
        }
        gradeCounts[grade.grade]++;
    });

    // Prepare data for the chart
    const labels = Object.keys(gradeCounts);
    const data = Object.values(gradeCounts);

    // Get the chart canvas
    const chartCanvas = document.getElementById('gradesChart');
    if (!chartCanvas) return;

    // Destroy existing chart instance if it exists
    if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
    }

    // Render the chart
    const ctx = chartCanvas.getContext('2d');
    chartCanvas.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Students',
                data: data,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Students'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Grades'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function renderAssignGradeForm() {
    const app = document.getElementById('app');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];

    // Filter students (users with role "student")
    const students = users.filter(user => user.role === 'student');

    app.innerHTML = `
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <!-- Top Navigation -->
            <div class="bg-blue-800 dark:bg-blue-900 text-white p-4 shadow-lg">
                <div class="container mx-auto flex justify-between items-center">
                    <h4 class="text-xl font-bold">Assign Grades</h4>
                    <nav>
                        <ul class="flex space-x-4">
                            <li><button class="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition duration-300" onclick="renderTeacherView()">Back to Dashboard</button></li>
                            <li><button id="logoutButton" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-all">Logout</button></li>
                        </ul>
                    </nav>
                </div>
            </div>

            <!-- Main Content -->
            <div class="container mx-auto p-8">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Assign Grades</h1>

                    <!-- Course Selector -->
                    <div class="mb-6">
                        <label for="courseSelector" class="block text-gray-700 dark:text-gray-300 mb-2">Select Course:</label>
                        <select id="courseSelector" class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dark:bg-gray-700 dark:text-white">
                            <option value="">Select a course</option>
                            ${courses.map(course => `
                                <option value="${course.id}">${course.name}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Students Table -->
                    <div id="studentsTableContainer" class="mt-6">
                        <p class="text-gray-600 dark:text-gray-300">Please select a course to assign grades.</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Attach event listener for course selector
    document.getElementById('courseSelector').addEventListener('change', function () {
        const selectedCourseId = this.value;
        if (selectedCourseId) {
            renderStudentsTable(selectedCourseId);
        } else {
            document.getElementById('studentsTableContainer').innerHTML = '<p class="text-gray-600 dark:text-gray-300">Please select a course to assign grades.</p>';
        }
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        // Redirect to index.html
        window.location.href = 'index.html';
    });
}

function renderStudentsTable(courseId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];

    // Filter students (users with role "student")
    const students = users.filter(user => user.role === 'student');

    // Render the table
    const studentsTableContainer = document.getElementById('studentsTableContainer');
    studentsTableContainer.innerHTML = `
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Students</h3>
        <table class="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <thead class="bg-blue-600 dark:bg-blue-700 text-white">
                <tr>
                    <th class="p-3 text-left">Student Name</th>
                    <th class="p-3 text-left">Current Grade</th>
                    <th class="p-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => {
                    const studentGrade = grades.find(grade => grade.studentId === student.id && grade.courseId === parseInt(courseId));
                    return `
                        <tr class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td class="p-3 text-gray-900 dark:text-white">${student.name}</td>
                            <td class="p-3 text-gray-900 dark:text-white">${studentGrade ? studentGrade.grade : 'N/A'}</td>
                            <td class="p-3">
                                <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300" onclick="openGradeForm(${student.id}, ${courseId})">Assign/Edit Grade</button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function openGradeForm(studentId, courseId) {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const existingGrade = grades.find(grade => grade.studentId === studentId && grade.courseId === courseId);

    // Prompt for grade input
    const newGrade = prompt("Enter the grade for this student:", existingGrade ? existingGrade.grade : '');

    if (newGrade !== null) {
        // Save or update the grade
        if (existingGrade) {
            existingGrade.grade = newGrade; // Update existing grade
        } else {
            grades.push({ studentId, courseId, grade: newGrade }); // Add new grade
        }

        // Save updated grades to localStorage
        localStorage.setItem('grades', JSON.stringify(grades));

        // Re-render the students table
        renderStudentsTable(courseId);
    }
}

// Make functions globally accessible
window.renderTeacherView = renderTeacherView;
window.renderStudentGradesView = renderStudentGradesView;
window.renderGradesTable = renderGradesTable;
window.renderAssignGradeForm = renderAssignGradeForm;

// Check for saved theme preference on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    // Render the default view (e.g., login page)
    
});