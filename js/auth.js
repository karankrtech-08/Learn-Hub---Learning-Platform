// Authentication JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAuthPage();
    
    // Check if user is already logged in
    checkCurrentUser();
    
    // Setup form validation
    setupFormValidation();
});

// Initialize Auth Page
function initAuthPage() {
    // Determine if we're on login or register page
    const isLoginPage = window.location.pathname.includes('login.html');
    const isRegisterPage = window.location.pathname.includes('register.html');
    
    if (isLoginPage) {
        initLoginPage();
    } else if (isRegisterPage) {
        initRegisterPage();
    }
}

// Initialize Login Page
function initLoginPage() {
    const loginForm = document.getElementById('login-form');
    const showPasswordBtn = document.getElementById('show-password');
    const rememberMe = document.getElementById('remember-me');
    const forgotPasswordBtn = document.getElementById('forgot-password');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', togglePasswordVisibility);
    }
    
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', handleForgotPassword);
    }
    
    // Load remember me data
    if (rememberMe && rememberMe.checked) {
        const savedEmail = localStorage.getItem('rememberEmail');
        const savedPassword = localStorage.getItem('rememberPassword');
        
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (savedEmail && emailInput) {
            emailInput.value = savedEmail;
        }
        
        if (savedPassword && passwordInput) {
            passwordInput.value = savedPassword;
        }
    }
}

// Initialize Register Page
function initRegisterPage() {
    const registerForm = document.getElementById('register-form');
    const showPasswordBtn = document.getElementById('show-password');
    const showConfirmPasswordBtn = document.getElementById('show-confirm-password');
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility('password');
        });
    }
    
    if (showConfirmPasswordBtn) {
        showConfirmPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility('confirm-password');
        });
    }
    
    // Real-time password strength check
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
}

// Check Current User
function checkCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    
    // If user is already logged in, redirect to dashboard
    if (currentUser && (window.location.pathname.includes('login.html') || 
                       window.location.pathname.includes('register.html'))) {
        showToast('You are already logged in', 'info');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }
    
    // If user is not logged in but on dashboard, redirect to login
    if (!currentUser && window.location.pathname.includes('dashboard.html')) {
        showToast('Please login to access dashboard', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }
}

// Setup Form Validation
function setupFormValidation() {
    // Add validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!validateForm(this)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, false);
        
        // Add real-time validation
        const inputs = form.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    });
}

// Validate Form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Special validation for register form
    if (form.id === 'register-form') {
        const password = form.querySelector('#password');
        const confirmPassword = form.querySelector('#confirm-password');
        
        if (password && confirmPassword && password.value !== confirmPassword.value) {
            showFieldError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }
    }
    
    return isValid;
}

// Validate Field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name || field.id;
    
    // Clear previous error
    clearFieldError(field);
    
    // Check if field is empty
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' || name.includes('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Password validation
    if (type === 'password' || name.includes('password')) {
        if (value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters');
            return false;
        }
        
        // For register form, check password strength
        if (name === 'password' && window.location.pathname.includes('register.html')) {
            const strength = getPasswordStrength(value);
            if (strength.score < 2) {
                showFieldError(field, 'Password is too weak. Use uppercase, lowercase, numbers, and symbols');
                return false;
            }
        }
    }
    
    // Phone validation
    if (type === 'tel' || name.includes('phone')) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// Show Field Error
function showFieldError(field, message) {
    // Add error class to field
    field.classList.add('error');
    
    // Create or update error message
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    
    // Add shake animation
    field.classList.add('animate-shake');
    setTimeout(() => {
        field.classList.remove('animate-shake');
    }, 500);
}

// Clear Field Error
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.nextElementSibling;
    if (errorElement && errorElement.classList.contains('error-message')) {
        errorElement.remove();
    }
}

// Toggle Password Visibility
function togglePasswordVisibility(fieldId) {
    const field = document.getElementById(fieldId);
    const button = document.querySelector(`[data-field="${fieldId}"]`);
    
    if (field && button) {
        const type = field.type === 'password' ? 'text' : 'password';
        field.type = type;
        
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        }
    }
}

// Check Password Strength
function checkPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.getElementById('password-strength');
    const strengthText = document.getElementById('password-strength-text');
    
    if (!passwordInput || !strengthMeter) return;
    
    const password = passwordInput.value;
    const strength = getPasswordStrength(password);
    
    // Update strength meter
    strengthMeter.className = 'h-2 rounded-full transition-all duration-300';
    
    if (password.length === 0) {
        strengthMeter.classList.add('bg-gray-200');
        if (strengthText) strengthText.textContent = '';
        return;
    }
    
    switch(strength.score) {
        case 0:
        case 1:
            strengthMeter.classList.add('bg-red-500');
            strengthMeter.style.width = '25%';
            if (strengthText) strengthText.textContent = 'Weak';
            break;
        case 2:
            strengthMeter.classList.add('bg-yellow-500');
            strengthMeter.style.width = '50%';
            if (strengthText) strengthText.textContent = 'Fair';
            break;
        case 3:
            strengthMeter.classList.add('bg-blue-500');
            strengthMeter.style.width = '75%';
            if (strengthText) strengthText.textContent = 'Good';
            break;
        case 4:
            strengthMeter.classList.add('bg-green-500');
            strengthMeter.style.width = '100%';
            if (strengthText) strengthText.textContent = 'Strong';
            break;
    }
}

// Get Password Strength
function getPasswordStrength(password) {
    let score = 0;
    const requirements = {
        length: false,
        lowercase: false,
        uppercase: false,
        numbers: false,
        symbols: false
    };
    
    // Length requirement
    if (password.length >= 8) {
        score++;
        requirements.length = true;
    }
    
    // Lowercase requirement
    if (/[a-z]/.test(password)) {
        score++;
        requirements.lowercase = true;
    }
    
    // Uppercase requirement
    if (/[A-Z]/.test(password)) {
        score++;
        requirements.uppercase = true;
    }
    
    // Numbers requirement
    if (/[0-9]/.test(password)) {
        score++;
        requirements.numbers = true;
    }
    
    // Symbols requirement
    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
        requirements.symbols = true;
    }
    
    return {
        score: score,
        requirements: requirements
    };
}

// Validate Email
function validateEmail() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        return false;
    }
    
    return true;
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const rememberMe = form.querySelector('#remember-me').checked;
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Logging in...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store remember me data
            if (rememberMe) {
                localStorage.setItem('rememberEmail', email);
                localStorage.setItem('rememberPassword', password);
            } else {
                localStorage.removeItem('rememberEmail');
                localStorage.removeItem('rememberPassword');
            }
            
            // Create user session
            const userSession = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || 'student',
                avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`,
                joined: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userSession));
            
            // Add to login history
            addToLoginHistory(userSession.id);
            
            showToast('Login successful!', 'success');
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid email or password', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value;
    const confirmPassword = form.querySelector('#confirm-password').value;
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Creating account...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showToast('Email already registered', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            role: 'student',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
            createdAt: new Date().toISOString(),
            profile: {
                bio: '',
                skills: [],
                education: '',
                experience: ''
            }
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create user session
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatar: newUser.avatar,
            joined: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        
        // Initialize user data
        initializeUserData(newUser.id);
        
        showToast('Account created successfully!', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    }, 1500);
}

// Handle Forgot Password
function handleForgotPassword() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter your email address', 'warning');
        return;
    }
    
    if (!validateEmail()) {
        return;
    }
    
    // Show modal or redirect to forgot password page
    showForgotPasswordModal(email);
}

// Show Forgot Password Modal
function showForgotPasswordModal(email) {
    const modalHTML = `
        <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 modal-overlay active">
            <div class="bg-white rounded-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-2xl font-bold">Reset Password</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <p class="text-gray-600 mb-6">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-gray-700 mb-2">Email Address</label>
                        <input type="email" 
                               id="reset-email" 
                               value="${email}"
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-300">
                        <div class="error-message text-red-500 text-sm mt-1"></div>
                    </div>
                    
                    <button id="send-reset-link" class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300">
                        Send Reset Link
                    </button>
                </div>
                
                <p class="text-sm text-gray-500 mt-6">
                    Remember your password? 
                    <a href="login.html" class="text-blue-600 hover:text-blue-800 font-medium">Back to login</a>
                </p>
            </div>
        </div>
    `;
    
    // Add modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Add event listeners
    const closeBtn = modalContainer.querySelector('.close-modal');
    const overlay = modalContainer.querySelector('.modal-overlay');
    const sendBtn = modalContainer.querySelector('#send-reset-link');
    const resetEmail = modalContainer.querySelector('#reset-email');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modalContainer);
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(modalContainer);
            }
        });
    }
    
    if (sendBtn && resetEmail) {
        sendBtn.addEventListener('click', () => {
            const email = resetEmail.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                showModalError(resetEmail, 'Email is required');
                return;
            }
            
            if (!emailRegex.test(email)) {
                showModalError(resetEmail, 'Please enter a valid email');
                return;
            }
            
            // Simulate sending reset link
            sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            sendBtn.disabled = true;
            
            setTimeout(() => {
                showToast('Reset link sent to your email!', 'success');
                document.body.removeChild(modalContainer);
                
                // In a real app, you would send an actual email
                console.log(`Reset password link sent to: ${email}`);
            }, 1500);
        });
    }
}

// Show Modal Error
function showModalError(field, message) {
    const errorElement = field.nextElementSibling;
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    field.classList.add('animate-shake');
    field.focus();
    
    setTimeout(() => {
        field.classList.remove('animate-shake');
    }, 500);
}

// Add to Login History
function addToLoginHistory(userId) {
    const loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
    
    loginHistory.unshift({
        userId: userId,
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1', // In a real app, get from server
        device: navigator.userAgent,
        location: 'Unknown' // In a real app, get from IP
    });
    
    // Keep only last 10 logins
    const recentLogins = loginHistory.slice(0, 10);
    localStorage.setItem('loginHistory', JSON.stringify(recentLogins));
}

// Initialize User Data
function initializeUserData(userId) {
    // Initialize enrolled courses
    if (!localStorage.getItem('enrolledCourses')) {
        localStorage.setItem('enrolledCourses', JSON.stringify([]));
    }
    
    // Initialize completed lessons
    if (!localStorage.getItem('completedLessons')) {
        localStorage.setItem('completedLessons', JSON.stringify([]));
    }
    
    // Initialize progress
    if (!localStorage.getItem('userProgress')) {
        localStorage.setItem('userProgress', JSON.stringify({}));
    }
    
    // Initialize settings
    if (!localStorage.getItem('userSettings')) {
        localStorage.setItem('userSettings', JSON.stringify({
            userId: userId,
            emailNotifications: true,
            courseUpdates: true,
            marketingEmails: false,
            darkMode: false,
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }));
    }
}

// Logout Function
function logout() {
    // Clear user session
    localStorage.removeItem('currentUser');
    
    // Show logout message
    showToast('Logged out successfully', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// Check if User is Authenticated
function isAuthenticated() {
    return localStorage.getItem('currentUser') !== null;
}

// Get Current User
function getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

// Update User Profile
function updateUserProfile(profileData) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    // Update in users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...profileData,
            profile: {
                ...users[userIndex].profile,
                ...profileData.profile
            }
        };
        
        localStorage.setItem('users', JSON.stringify(users));
        
        // Update current user session
        const updatedUser = {
            ...currentUser,
            ...profileData
        };
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        showToast('Profile updated successfully', 'success');
        return true;
    }
    
    return false;
}

// Change Password
function changePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1 && users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        showToast('Password changed successfully', 'success');
        return true;
    }
    
    showToast('Current password is incorrect', 'error');
    return false;
}

// Toast Notification
function showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 transform transition-all duration-300 translate-x-full`;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            toast.className += ' bg-green-500';
            break;
        case 'error':
            toast.className += ' bg-red-500';
            break;
        case 'warning':
            toast.className += ' bg-yellow-500';
            break;
        default:
            toast.className += ' bg-blue-500';
    }
    
    toast.textContent = message;
    
    // Add icon
    const icon = document.createElement('i');
    icon.className = 'fas fa-info-circle mr-2';
    toast.prepend(icon);
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
        toast.classList.add('translate-x-0');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('translate-x-0');
        toast.classList.add('translate-x-full');
        
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isAuthenticated,
        getCurrentUser,
        logout,
        updateUserProfile,
        changePassword
    };
}