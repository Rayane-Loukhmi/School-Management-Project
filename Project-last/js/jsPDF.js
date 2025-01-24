// Retrieve users, groups, and courses from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function getGroups() {
    return JSON.parse(localStorage.getItem('groups')) || [];
}

function getCourses() {
    return JSON.parse(localStorage.getItem('courses')) || [];
}

// Export data to PDF
function exportDataToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Users and Groups Data", 10, 10);

    // Retrieve data
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];

    // Filter users by role
    const students = users.filter(user => user.role === 'student');
    const admins = users.filter(user => user.role === 'admin');
    const teachers = users.filter(user => user.role === 'teacher');

    // Add Students Table
    doc.setFontSize(14);
    doc.text("Students", 10, 20);
    doc.autoTable({
        startY: 25,
        head: [['ID', 'Name', 'Email', 'Gender', 'Password', 'Groups']],
        body: students.map(user => [
            user.id,
            user.name,
            user.email,
            user.gender || 'N/A', // Include gender
            user.password,
            user.groups ? user.groups.join(', ') : 'None'
        ]),
    });

    // Add Admins Table
    doc.setFontSize(14);
    doc.text("Admins", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['ID', 'Name', 'Email', 'Gender', 'Password', 'Groups']],
        body: admins.map(user => [
            user.id,
            user.name,
            user.email,
            user.gender || 'N/A', // Include gender
            user.password,
            user.groups ? user.groups.join(', ') : 'None'
        ]),
    });

    // Add Teachers Table
    doc.setFontSize(14);
    doc.text("Teachers", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['ID', 'Name', 'Email', 'Gender', 'Password', 'Groups']],
        body: teachers.map(user => [
            user.id,
            user.name,
            user.email,
            user.gender || 'N/A', // Include gender
            user.password,
            user.groups ? user.groups.join(', ') : 'None'
        ]),
    });

    // Add Groups Table
    doc.setFontSize(14);
    doc.text("Groups", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['ID', 'Name']],
        body: groups.map(group => [group.id, group.name]),
    });

    // Add Courses Table
    doc.setFontSize(14);
    doc.text("Courses", 10, doc.autoTable.previous.finalY + 10);
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 15,
        head: [['ID', 'Name', 'Teacher ID', 'Teacher Name']],
        body: courses.map(course => {
            const teacher = users.find(user => user.id === course.teacherId);
            return [
                course.id,
                course.name,
                course.teacherId,
                teacher ? teacher.name : 'Unknown Teacher'
            ];
        }),
    });

    // Save the PDF
    doc.save("users_groups_courses_data.pdf");
}