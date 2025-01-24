// studentView.js
function convertGradeToNumber(grade) {
    const gradeMap = {
        "A+": 20,
        "A": 19,
        "A-": 18,
        "B+": 17,
        "B": 16,
        "B-": 15,
        "C+": 14,
        "C": 13,
        "C-": 12,
        "D+": 11,
        "D": 10,
        "D-": 9,
        "F": 0
    };
    return gradeMap[grade] || 0; // Default to 0 if the grade is not found
}

function calculateAverage(studentGrades) {
    if (studentGrades.length === 0) return 0; // Avoid division by zero

    const total = studentGrades.reduce((sum, grade) => {
        return sum + convertGradeToNumber(grade.grade);
    }, 0);

    return (total / studentGrades.length).toFixed(2); // Round to 2 decimal places
}

function renderStudentView() {
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const studentId = 3; // Example student ID (replace with dynamic ID if needed)

    // Find the student's name
    const student = users.find(user => user.id === studentId);
    const studentName = student ? student.name : "Unknown Student";

    const studentGrades = grades.filter(grade => grade.studentId === studentId);

    // Calculate the average
    const average = calculateAverage(studentGrades);

    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="flex min-h-screen bg-gray-100">
            <!-- Main Content -->
            <div class="flex-grow p-8 bg-white">
                <!-- Logo and Student Dashboard Heading -->
                <div class="flex items-center mb-6">
                    <img src="images/logo.png" alt="Logo" class="w-24 h-24 mr-4"> <!-- Bigger Logo -->
                    <h1 class="text-2xl font-bold text-gray-800">Student Dashboard</h1>
                </div>

                <!-- Logout Button -->
                <div class="flex justify-end mb-6">
                    <button id="logoutButton" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                        Logout
                    </button>
                </div>

                <h2 class="text-xl font-semibold text-gray-700 mb-2">Student Name : <strong>${studentName}</strong></h2> <!-- Student Name -->
                <h2 class="text-xl font-semibold text-gray-700 mb-4">Your Grades</h2>
                <table class="w-full bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <thead class="bg-blue-600 text-white">
                        <tr>
                            <th class="p-3 text-left">Course</th>
                            <th class="p-3 text-left">Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentGrades.map(grade => {
                            const course = courses.find(c => c.id === grade.courseId);
                            return `
                                <tr class="border-b border-gray-200 hover:bg-gray-50">
                                    <td class="p-3">${course ? course.name : 'Unknown'}</td>
                                    <td class="p-3">${grade.grade}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>

                <!-- Table for Average -->
                <table class="w-full bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <thead class="bg-blue-600 text-white">
                        <tr>
                            <th class="p-3 text-left">Moyenne des Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="border-b border-gray-200 hover:bg-gray-50">
                            <td class="p-3">${average}</td>
                        </tr>
                    </tbody>
                </table>

                <!-- Export Button -->
                <div class="flex justify-center mt-8">
                    <button id="exportButton" class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300">
                        Export Grades as PDF
                    </button>
                </div>
            </div>
        </div>
    `;

    // Attach event listener for the export button
    document.getElementById('exportButton').addEventListener('click', function () {
        exportStudentGrades(studentGrades, courses, average);
    });

    // Attach event listener for the logout button
    document.getElementById('logoutButton').addEventListener('click', function () {
        logout();
    });
}

// Function to handle logout
function logout() {
    // Clear the current view and login state from localStorage
    localStorage.removeItem('currentView');
    localStorage.removeItem('isLoggedIn');

    // Redirect to the login page (or any other page)
    window.location.href = 'index.html'; // Replace with your login page URL
}

// Function to export student grades as PDF
function exportStudentGrades(studentGrades, courses, average) {
    // Access jsPDF from the global window object
    const { jsPDF } = window.jspdf;

    // Create a new jsPDF instance
    const doc = new jsPDF();

    // Add a title to the PDF
    doc.setFontSize(18);
    doc.text("Student Grades", 10, 10);

    // Add the Moyenne des Notes to the PDF
    doc.setFontSize(12);
    doc.text(`Moyenne des Notes: ${average}`, 10, 20);

    // Create the table headers
    const headers = ["Course", "Grade"];
    const data = studentGrades.map(grade => {
        const course = courses.find(c => c.id === grade.courseId);
        return [course ? course.name : 'Unknown', grade.grade];
    });

    // Add the table to the PDF
    doc.autoTable({
        head: [headers],
        body: data,
        startY: 30, // Start below the title and average
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] } // Blue header
    });

    // Save the PDF
    doc.save("Student_Grades.pdf");
}

// Make functions globally accessible
window.renderStudentView = renderStudentView;