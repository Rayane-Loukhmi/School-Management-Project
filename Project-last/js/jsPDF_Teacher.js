function renderExportGradesView_Teacher() {
    const app = document.getElementById('app');
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    app.innerHTML = `
        <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
            <!-- Top Navigation -->
            <div class="bg-blue-800 dark:bg-blue-900 text-white p-4 shadow-lg">
                <div class="container mx-auto flex justify-between items-center">
                    <h4 class="text-xl font-bold">Export Grades as PDF</h4>
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
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Select Groups to Export</h1>

                    <!-- Group Selector -->
                    <div class="mb-6">
                        <label for="groupSelector" class="block text-gray-700 dark:text-gray-300 mb-2">Select Groups:</label>
                        <select id="groupSelector" multiple class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all dark:bg-gray-700 dark:text-white">
                            ${groups.map(group => `
                                <option value="${group.id}">${group.name}</option>
                            `).join('')}
                        </select>
                    </div>

                    <!-- Download PDF Button -->
                    <button id="downloadPDFButton" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Download PDF</button>
                </div>
            </div>
        </div>
    `;

    // Attach event listener for the Download PDF button
    document.getElementById('downloadPDFButton').addEventListener('click', () => {
        const selectedGroupIds = Array.from(document.getElementById('groupSelector').selectedOptions).map(option => option.value);
        if (selectedGroupIds.length === 0) {
            alert('Please select at least one group.');
            return;
        }
        exportGradesToPDF_Teacher(selectedGroupIds);
    });

    // Attach event listener for logout button
    document.getElementById('logoutButton').addEventListener('click', function () {
        window.location.href = 'index.html';
    });
}

function exportGradesToPDF_Teacher(selectedGroupIds) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const grades = JSON.parse(localStorage.getItem('grades')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];

    // Create a new PDF document
    const doc = new jspdf.jsPDF();

    // Loop through each selected group
    selectedGroupIds.forEach((groupId, index) => {
        const group = groups.find(g => g.id === parseInt(groupId));
        if (!group) return;

        // Filter students in the current group
        const studentsInGroup = users.filter(user => user.role === 'student' && user.groups.includes(group.id));

        // Filter grades for students in the current group
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

        // Prepare data for the PDF table
        const tableData = gradesByStudent.map(studentData => {
            const row = [studentData.student.name];
            courses.forEach(course => {
                const grade = studentData.grades.find(g => g.course === course.name);
                row.push(grade ? grade.grade : 'N/A');
            });
            return row;
        });

        // Add group name as title
        doc.setFontSize(18);
        doc.text(`Grades for ${group.name}`, 14, doc.autoTable.previous.finalY + 20 || 22);

        // Add table headers
        const headers = ["Student Name", ...courses.map(course => course.name)];

        // Generate the table
        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: doc.autoTable.previous.finalY + 25 || 30,
            theme: 'grid',
            styles: { fontSize: 12 },
            headStyles: { fillColor: [59, 130, 246] }
        });

        // Add a page break if there are more groups to process
        if (index < selectedGroupIds.length - 1) {
            doc.addPage();
        }
    });

    // Save the PDF with a generic name
    doc.save('Grades_Export.pdf');
}