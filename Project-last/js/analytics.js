// js/analytics.js

// Render the "Analytics" view

function renderAdminAnalytics() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalTeachers = users.filter(user => user.role === 'teacher').length;
    const totalAdmins = users.filter(user => user.role === 'admin').length;
    const totalUsers = users.length;

    const adminContent = document.getElementById('adminContent');
    adminContent.innerHTML = `
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Students</h3>
                <p class="text-2xl font-bold text-gray-900">${totalStudents}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Teachers</h3>
                <p class="text-2xl font-bold text-gray-900">${totalTeachers}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Admins</h3>
                <p class="text-2xl font-bold text-gray-900">${totalAdmins}</p>
            </div>
        </div>

        <!-- Chart Containers -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">User Distribution (Pie Chart)</h3>
                <canvas id="userPieChart"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">Courses by Teacher (Bar Chart)</h3>
                <canvas id="courseBarChart"></canvas>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">Students per Group (Donut Chart)</h3>
                <canvas id="donutChart" width="400" height="400"></canvas>
            </div>
        </div>

        <!-- Gender Distribution Section -->
        <div class="mt-6">
            <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-700 mb-4">Gender Distribution (Bar Chart)</h3>
                <div class="mb-4">
                    <label for="roleFilter" class="block text-gray-700 mb-2">Filter by Role</label>
                    <select id="roleFilter" class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="all">All</option>
                        <option value="student">Students</option>
                        <option value="teacher">Teachers</option>
                        <option value="admin">Admins</option>
                    </select>
                    <button onclick="renderGenderChart()" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-blue-700 transition duration-300">Generate Chart</button>
                </div>
                <canvas id="genderChart"></canvas>
            </div>
        </div>
    `;

    // Render the charts
    renderUserPieChart(); // Call the function from analytics.js
    renderCourseBarChart(); // Call the function from analytics.js
    renderDonutChart(); // Call the function for donut chart
    renderGenderChart(); // Call the function for gender distribution bar chart
}

// Render Pie Chart for User Distribution
function renderUserPieChart() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const totalStudents = users.filter(user => user.role === 'student').length;
    const totalTeachers = users.filter(user => user.role === 'teacher').length;
    const totalAdmins = users.filter(user => user.role === 'admin').length;

    const pieChartCtx = document.getElementById('userPieChart').getContext('2d');
    new Chart(pieChartCtx, {
        type: 'pie',
        data: {
            labels: ['Students', 'Teachers', 'Admins'],
            datasets: [{
                label: 'User Distribution',
                data: [totalStudents, totalTeachers, totalAdmins],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Red for Students
                    'rgba(54, 162, 235, 0.6)', // Blue for Teachers
                    'rgba(75, 192, 192, 0.6)', // Green for Admins
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            }],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        },
    });
}

// Render Bar Chart for Courses
function renderCourseBarChart() {
    // Fetch course data from localStorage
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Group courses by teacherId
    const coursesByTeacher = courses.reduce((acc, course) => {
        const teacherId = course.teacherId;
        if (!acc[teacherId]) {
            acc[teacherId] = 0;
        }
        acc[teacherId]++;
        return acc;
    }, {});

    // Extract teacherIds and course counts
    const teacherIds = Object.keys(coursesByTeacher);
    const courseCounts = Object.values(coursesByTeacher);

    // Get the chart context
    const barChartCtx = document.getElementById('courseBarChart').getContext('2d');

    // Render the bar chart
    new Chart(barChartCtx, {
        type: 'bar',
        data: {
            labels: teacherIds.map(id => `Teacher ${id}`), // Teacher IDs on the x-axis
            datasets: [
                {
                    label: 'Number of Courses',
                    data: courseCounts, // Number of courses per teacher
                    backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue for courses
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Courses',
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: 'Teachers',
                    },
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
}

function renderDonutChart() {
    const groupCounts = countStudentsPerGroup();
    const labels = Object.keys(groupCounts);
    const data = Object.values(groupCounts);

    const ctx = document.getElementById('donutChart').getContext('2d');
    const donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Students per Group',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Students per Group'
                }
            }
        }
    });
}

//render gedner chart
function renderGenderChart() {
    const roleFilter = document.getElementById('roleFilter')?.value || 'all';
    const users = JSON.parse(localStorage.getItem('users')) || [];

    console.log("All Users:", users); // Debug: Log all users

    // Filter users by role
    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter(user => user.role === roleFilter);

    console.log("Filtered Users:", filteredUsers); // Debug: Log filtered users

    // Count genders
    const genderCounts = filteredUsers.reduce((acc, user) => {
        if (user.gender) {
            acc[user.gender] = (acc[user.gender] || 0) + 1;
        }
        return acc;
    }, {});

    console.log("Gender Counts:", genderCounts); // Debug: Log gender counts

    // Map genders to colors
    const genderColors = {
        male: 'blue',
        female: 'pink'
    };

    // Get chart context
    const ctx = document.getElementById('genderChart').getContext('2d');

    // Destroy existing chart instance if it exists
    if (window.genderChart && typeof window.genderChart.destroy === 'function') {
        window.genderChart.destroy();
    }

    // Create new chart
    window.genderChart = new Chart(ctx, {
        type: 'bar', // Bar chart
        data: {
            labels: Object.keys(genderCounts), // Labels: Male, Female
            datasets: [{
                label: 'Gender Distribution',
                data: Object.values(genderCounts), // Data: Counts for each gender
                backgroundColor: Object.keys(genderCounts).map(gender => genderColors[gender]), // Map colors to genders
                borderColor: Object.keys(genderCounts).map(gender => genderColors[gender]), // Map border colors to genders
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Users'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Gender'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            return `${context.label}: ${context.raw}`;
                        }
                    }
                }
            }
        }
    });
}