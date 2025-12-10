// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initNavigation();
    initWhatsAppFloat();
    initCourseLoader();
    initAnimations();
    initEventListeners();
    initBackToTop();
    
    // Check for notifications
    checkNotifications();
    
    // Initialize user session if exists
    checkUserSession();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg');
            navbar.classList.remove('bg-white/90');
            navbar.classList.add('bg-white');
        } else {
            navbar.classList.remove('shadow-lg');
            navbar.classList.add('bg-white/90');
            navbar.classList.remove('bg-white');
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.contains(event.target) && 
            mobileMenuBtn && !mobileMenuBtn.contains(event.target) && 
            !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// WhatsApp Float functionality
function initWhatsAppFloat() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappOptions = document.getElementById('whatsapp-options');
    const whatsappNotification = document.getElementById('whatsapp-notification');
    
    if (whatsappBtn && whatsappOptions) {
        let isOpen = false;
        
        whatsappBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            isOpen = !isOpen;
            whatsappOptions.classList.toggle('hidden', !isOpen);
            
            // Hide notification when opened
            if (isOpen && whatsappNotification) {
                whatsappNotification.classList.add('hidden');
                localStorage.setItem('whatsappNotificationSeen', 'true');
            }
        });
        
        // Close when clicking outside
        document.addEventListener('click', function() {
            if (isOpen) {
                whatsappOptions.classList.add('hidden');
                isOpen = false;
            }
        });
        
        // Prevent closing when clicking inside
        whatsappOptions.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        
        // Show notification after 3 seconds
        setTimeout(() => {
            const hasSeen = localStorage.getItem('whatsappNotificationSeen');
            if (!hasSeen && whatsappNotification) {
                whatsappNotification.classList.remove('hidden');
            }
        }, 3000);
    }
}

// Course loader for home page
function initCourseLoader() {
    const coursesContainer = document.getElementById('courses-container');
    
    if (coursesContainer) {
        const courses = [
            {
                id: 1,
                title: "Full Stack Web Development",
                instructor: "Alex Johnson",
                rating: 4.9,
                students: 12450,
                duration: "12 weeks",
                price: "$199",
                category: "Web Development",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 2,
                title: "Machine Learning Masterclass",
                instructor: "Dr. Sarah Chen",
                rating: 4.8,
                students: 8560,
                duration: "16 weeks",
                price: "$299",
                category: "Data Science",
                image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            },
            {
                id: 3,
                title: "UI/UX Design Fundamentals",
                instructor: "Maria Garcia",
                rating: 4.7,
                students: 9320,
                duration: "8 weeks",
                price: "$149",
                category: "Design",
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
            }
        ];
        
        courses.forEach(course => {
            const courseElement = createCourseCard(course);
            coursesContainer.innerHTML += courseElement;
        });
        
        // Add click event to course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', function() {
                const courseId = this.dataset.id;
                localStorage.setItem('selectedCourse', courseId);
                window.location.href = 'pages/courses.html';
            });
        });
    }
}

function createCourseCard(course) {
    return `
        <div class="course-card hover-card bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-2xl" data-id="${course.id}">
            <div class="relative">
                <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span class="text-sm font-semibold text-gray-800">${course.category}</span>
                </div>
                <div class="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-lg">
                    <span class="text-sm font-bold">${course.price}</span>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${course.title}</h3>
                <p class="text-gray-600 mb-4">By ${course.instructor}</p>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="flex text-yellow-400 mr-2">
                            ${generateStars(course.rating)}
                        </div>
                        <span class="text-gray-700 font-semibold">${course.rating}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="far fa-clock mr-1"></i>
                        <span>${course.duration}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-users mr-2"></i>
                        <span>${course.students.toLocaleString()} students</span>
                    </div>
                    <button class="enroll-btn px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300" data-id="${course.id}">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Animations
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.feature-card, .testimonial-card, .course-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Event Listeners
function initEventListeners() {
    // Demo button
    const watchDemoBtn = document.getElementById('watch-demo');
    const demoModal = document.getElementById('demo-modal');
    const closeDemoBtn = document.getElementById('close-demo');
    
    if (watchDemoBtn && demoModal) {
        watchDemoBtn.addEventListener('click', function() {
            demoModal.classList.remove('hidden');
            demoModal.classList.add('flex');
        });
    }
    
    if (closeDemoBtn && demoModal) {
        closeDemoBtn.addEventListener('click', function() {
            demoModal.classList.add('hidden');
            demoModal.classList.remove('flex');
        });
    }
    
    // Contact sales button
    const contactSalesBtn = document.getElementById('contact-sales');
    if (contactSalesBtn) {
        contactSalesBtn.addEventListener('click', function() {
            showToast('Our sales team will contact you shortly!', 'info');
        });
    }
    
    // Enroll buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('enroll-btn')) {
            const courseId = e.target.dataset.id;
            handleEnrollment(courseId);
        }
    });
    
    // Demo modal close on outside click
    if (demoModal) {
        demoModal.addEventListener('click', function(e) {
            if (e.target === demoModal) {
                demoModal.classList.add('hidden');
                demoModal.classList.remove('flex');
            }
        });
    }
}

// Back to Top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Enrollment handling
function handleEnrollment(courseId) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        showToast('Please login to enroll in courses', 'warning');
        setTimeout(() => {
            window.location.href = 'pages/login.html';
        }, 1500);
        return;
    }
    
    // Add course to user's enrolled courses
    let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    
    if (!enrolledCourses.includes(parseInt(courseId))) {
        enrolledCourses.push(parseInt(courseId));
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        showToast('Successfully enrolled in course!', 'success');
        
        // Update notification
        updateNotificationCount();
    } else {
        showToast('You are already enrolled in this course', 'info');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const backgroundColor = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    }[type];
    
    Toastify({
        text: message,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: backgroundColor,
        stopOnFocus: true
    }).showToast();
}

// Check notifications
function checkNotifications() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    updateNotificationCount();
}

function updateNotificationCount() {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    const notificationBadge = document.querySelector('.notification-badge');
    
    if (notificationBadge && enrolledCourses.length > 0) {
        notificationBadge.textContent = enrolledCourses.length;
        notificationBadge.classList.remove('hidden');
    }
}

// Check user session
function checkUserSession() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const loginBtn = document.querySelector('a[href="pages/login.html"]');
    const registerBtn = document.querySelector('a[href="pages/register.html"]');
    
    if (user && loginBtn && registerBtn) {
        loginBtn.textContent = user.name.split(' ')[0];
        loginBtn.href = 'pages/dashboard.html';
        registerBtn.textContent = 'Dashboard';
        registerBtn.href = 'pages/dashboard.html';
    }
}

// Page-specific initialization
if (window.location.pathname.includes('courses.html')) {
    // Load courses page specific functionality
    setTimeout(() => {
        if (typeof initCoursesPage === 'function') {
            initCoursesPage();
        }
    }, 100);
}

if (window.location.pathname.includes('dashboard.html')) {
    // Load dashboard specific functionality
    setTimeout(() => {
        if (typeof initDashboard === 'function') {
            initDashboard();
        }
    }, 100);
}