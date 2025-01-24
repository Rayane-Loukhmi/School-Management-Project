initializeLocalStorage();

function renderDashboard(role) {
    const loginForm = document.getElementById('loginForm');
    loginForm.style.display = 'none';

    if (role === 'admin') {
        renderAdminView();
    } else if (role === 'teacher') {
        renderTeacherView();
    } else if (role === 'student') {
        renderStudentView();
    }
}

window.renderDashboard = renderDashboard;