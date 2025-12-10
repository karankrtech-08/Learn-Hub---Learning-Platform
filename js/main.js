// Main JavaScript Functions

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Initialize all modules
    initModules();
    
    // Set up event listeners
    setupEventListeners();
});

// Check authentication status
function checkAuthStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser && authButtons) {
        const user = JSON.parse(currentUser);
        authButtons.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="relative group">
                    <button class="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300">
                        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <span class="font-medium">${user.name.split(' ')[0]}</span>
                        <i class="fas fa-chevron-down text-sm"></i>
                    </button>
                    <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block z-50">
                        <a href="pages/dashboard.html" class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-300">
                            <i class="fas fa-tachometer-alt mr-2"></i>
                            Dashboard
                        </a>
                        <a href="pages/courses.html" class="block px-4 py-2 hover:bg-gray-100 transition-colors duration-300">
                            <i class="fas fa-book mr-2"></i>
                            My Courses
                        </a>
                        <div class="border-t my-2"></div>
                        <button onclick="logout()" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-300">
                            <i class="fas fa-sign-out-alt mr-2"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize all modules
function initModules() {
    initCourseFilters();
    initProgressBars();
    initCounters();
    initNotifications();
    initChatWidget();
    initSearch();
}

// Course Filtering
function initCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter courses
            courseCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.remove('hidden');
                        card.classList.add('animate-scale-in');
                    }, 100);
                } else {
                    card.classList.add('hidden');
                    card.classList.remove('animate-scale-in');
                }
            });
        });
    });
}

// Progress Bars Animation
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = `${progress}%`;
                entry.target.classList.add('progress-animation');
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => observer.observe(bar));
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.count-up');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target.toLocaleString() + (counter.dataset.suffix || '');
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current).toLocaleString() + (counter.dataset.suffix || '');
            }
        }, 16);
    });
}

// Notifications System
function initNotifications() {
    const notificationBell = document.getElementById('notification-bell');
    const notificationPanel = document.getElementById('notification-panel');
    
    if (notificationBell && notificationPanel) {
        notificationBell.addEventListener('click', function() {
            notificationPanel.classList.toggle('hidden');
            // Mark notifications as read
            markNotificationsAsRead();
        });
        
        // Close notification panel when clicking outside
        document.addEventListener('click', function(event) {
            if (!notificationBell.contains(event.target) && !notificationPanel.contains(event.target)) {
                notificationPanel.classList.add('hidden');
            }
        });
        
        // Load notifications
        loadNotifications();
    }
}

function loadNotifications() {
    const notifications = [
        {
            id: 1,
            title: 'Welcome to LearnHub!',
            message: 'Start your learning journey today.',
            time: '2 hours ago',
            read: false
        },
        {
            id: 2,
            title: 'New Course Available',
            message: 'Check out our new Web Development course.',
            time: '1 day ago',
            read: false
        },
        {
            id: 3,
            title: 'Assignment Due',
            message: 'Your Data Science assignment is due tomorrow.',
            time: '2 days ago',
            read: true
        }
    ];
    
    const notificationList = document.getElementById('notification-list');
    if (notificationList) {
        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer ${notif.read ? '' : 'bg-blue-50'}" data-id="${notif.id}">
                <div class="flex items-start">
                    <div class="w-2 h-2 mt-2 rounded-full ${notif.read ? 'bg-gray-400' : 'bg-blue-500'} mr-3"></div>
                    <div>
                        <h4 class="font-semibold">${notif.title}</h4>
                        <p class="text-gray-600 text-sm">${notif.message}</p>
                        <p class="text-gray-400 text-xs mt-1">${notif.time}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function markNotificationsAsRead() {
    const notificationItems = document.querySelectorAll('.notification-item');
    notificationItems.forEach(item => {
        item.classList.remove('bg-blue-50');
        const dot = item.querySelector('.w-2');
        if (dot) dot.classList.replace('bg-blue-500', 'bg-gray-400');
    });
}

// Chat Widget
function initChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    
    if (chatToggle && chatWidget) {
        chatToggle.addEventListener('click', function() {
            chatWidget.classList.toggle('hidden');
            if (!chatWidget.classList.contains('hidden')) {
                loadChatMessages();
                chatInput.focus();
            }
        });
        
        if (chatClose) {
            chatClose.addEventListener('click', function() {
                chatWidget.classList.add('hidden');
            });
        }
        
        if (chatSend && chatInput) {
            chatSend.addEventListener('click', sendMessage);
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') sendMessage();
            });
        }
    }
}

function loadChatMessages() {
    const messages = [
        { sender: 'bot', text: 'Hello! How can I help you today?', time: '10:00 AM' },
        { sender: 'user', text: 'I need help with my course progress.', time: '10:02 AM' },
        { sender: 'bot', text: 'Sure! Which course are you having trouble with?', time: '10:03 AM' }
    ];
    
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = messages.map(msg => `
            <div class="flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4">
                <div class="${msg.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-3 max-w-xs">
                    <p class="text-gray-800">${msg.text}</p>
                    <p class="text-xs text-gray-500 mt-1 text-right">${msg.time}</p>
                </div>
            </div>
        `).join('');
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatInput || !chatInput.value.trim() || !chatMessages) return;
    
    const message = chatInput.value.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message
    chatMessages.innerHTML += `
        <div class="flex justify-end mb-4">
            <div class="bg-blue-100 rounded-lg p-3 max-w-xs">
                <p class="text-gray-800">${message}</p>
                <p class="text-xs text-gray-500 mt-1 text-right">${time}</p>
            </div>
        </div>
    `;
    
    chatInput.value = '';
    
    // Simulate bot response after 1 second
    setTimeout(() => {
        const responses = [
            "I understand. Let me check that for you.",
            "Great question! Here's what I found:",
            "I'll help you with that right away.",
            "Thanks for asking! Here's the information you need."
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        chatMessages.innerHTML += `
            <div class="flex justify-start mb-4">
                <div class="bg-gray-100 rounded-lg p-3 max-w-xs">
                    <p class="text-gray-800">${randomResponse}</p>
                    <p class="text-xs text-gray-500 mt-1 text-right">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
            </div>
        `;
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1000);
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            const query = this.value.trim();
            if (query.length < 2) {
                searchResults.classList.add('hidden');
                return;
            }
            
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        });
        
        // Close results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                searchResults.classList.add('hidden');
            }
        });
    }
}

function performSearch(query) {
    const courses = [
        { id: 1, title: 'Full Stack Web Development', category: 'Web Development' },
        { id: 2, title: 'Machine Learning Masterclass', category: 'Data Science' },
        { id: 3, title: 'UI/UX Design Fundamentals', category: 'Design' },
        { id: 4, title: 'Mobile App Development', category: 'Mobile' },
        { id: 5, title: 'Data Structures & Algorithms', category: 'Programming' }
    ];
    
    const results = courses.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.category.toLowerCase().includes(query.toLowerCase())
    );
    
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        if (results.length > 0) {
            searchResults.innerHTML = results.map(course => `
                <a href="pages/courses.html?course=${course.id}" class="block p-3 hover:bg-gray-100 transition-colors duration-300">
                    <div class="font-medium">${course.title}</div>
                    <div class="text-sm text-gray-600">${course.category}</div>
                </a>
            `).join('');
            searchResults.classList.remove('hidden');
        } else {
            searchResults.innerHTML = '<div class="p-3 text-gray-500">No results found</div>';
            searchResults.classList.remove('hidden');
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Watch demo button
    const watchDemoBtn = document.getElementById('watch-demo');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function() {
            const modal = document.getElementById('demo-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    }
    
    // Close demo modal
    const closeDemoBtn = document.getElementById('close-demo');
    if (closeDemoBtn) {
        closeDemoBtn.addEventListener('click', function() {
            const modal = document.getElementById('demo-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
    
    // Course enrollment
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('enroll-btn')) {
            const courseId = event.target.dataset.courseId;
            enrollInCourse(courseId);
        }
    });
    
    // Mark as completed
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('mark-completed')) {
            const lessonId = event.target.dataset.lessonId;
            markLessonCompleted(lessonId);
        }
    });
}

// Course Enrollment
function enrollInCourse(courseId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        showToast('Please login to enroll in courses', 'warning');
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 1500);
        return;
    }
    
    let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    
    if (!enrolledCourses.includes(parseInt(courseId))) {
        enrolledCourses.push(parseInt(courseId));
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        showToast('Successfully enrolled in course!', 'success');
        
        // Update UI
        const enrollBtn = document.querySelector(`[data-course-id="${courseId}"]`);
        if (enrollBtn) {
            enrollBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Enrolled';
            enrollBtn.classList.add('bg-green-100', 'text-green-700');
            enrollBtn.classList.remove('bg-blue-100', 'text-blue-600');
        }
    } else {
        showToast('You are already enrolled in this course', 'info');
    }
}

// Mark Lesson as Completed
function markLessonCompleted(lessonId) {
    let completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        
        const checkBtn = document.querySelector(`[data-lesson-id="${lessonId}"]`);
        if (checkBtn) {
            checkBtn.innerHTML = '<i class="fas fa-check-circle text-green-500 mr-2"></i>Completed';
            checkBtn.classList.add('text-green-600');
            checkBtn.classList.remove('text-blue-600');
        }
        
        showToast('Lesson marked as completed!', 'success');
        updateProgress();
    }
}

// Update Progress
function updateProgress() {
    const completedLessons = JSON.parse(localStorage.getItem('completedLessons')) || [];
    const totalLessons = document.querySelectorAll('.lesson-item').length;
    
    if (totalLessons > 0) {
        const progress = (completedLessons.length / totalLessons) * 100;
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
            progressBar.dataset.progress = progress;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}% Complete`;
        }
    }
}

// Logout Function
function logout() {
    localStorage.removeItem('currentUser');
    showToast('Successfully logged out', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Toast Notification
function showToast(message, type = 'info') {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: type === 'success' ? '#10b981' : 
                       type === 'error' ? '#ef4444' : 
                       type === 'warning' ? '#f59e0b' : '#3b82f6',
        stopOnFocus: true
    }).showToast();
}

// Format Date
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAuthStatus,
        showToast,
        formatDate,
        debounce,
        throttle
    };
}