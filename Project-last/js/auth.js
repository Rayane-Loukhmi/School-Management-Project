function handleLogin(event) {
    event.preventDefault();

    // Check if the login form exists
    const loginForm = document.getElementById('loginForm');

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const roleInput = document.getElementById('role');

    if (!emailInput || !passwordInput || !roleInput) {
        console.error('Login form inputs not found!');
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;
    const role = roleInput.value;

    // Simulate authentication (replace with actual API call) fetch
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password && u.role === role);

    if (user) {

        
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful!');

        // Redirect based on role
        if (user.role === 'admin') {
            renderAdminView();
        } else if (user.role === 'teacher') {
            renderTeacherView();
        } else if (user.role === 'student') {
            renderStudentView();
        }
    } else {
        alert('Invalid credentials!');
    }
}

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.error('Login form not found!');
    }
});

window.handleLogin = handleLogin;