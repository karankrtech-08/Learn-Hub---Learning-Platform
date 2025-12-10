// Course Page JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCoursePage();
    loadCourseDetails();
    setupCourseEvents();
});

// Initialize Course Page
function initCoursePage() {
    // Load courses from localStorage or API
    const courses = getCourses();
    displayCourses(courses);
    
    // Initialize search
    initCourseSearch();
    
    // Initialize filters
    initCourseFilters();
    
    // Check enrolled courses
    highlightEnrolledCourses();
}

// Get Courses Data
function getCourses() {
    // In a real app, this would be an API call
    return [
        {
            id: 1,
            title: "Full Stack Web Development",
            description: "Master front-end and back-end development with modern technologies",
            instructor: "Alex Johnson",
            rating: 4.9,
            students: 12450,
            duration: "12 weeks",
            price: 199,
            category: "web-development",
            level: "Intermediate",
            modules: 24,
            projects: 8,
            certificate: true,
            tags: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
            syllabus: [
                "HTML5 & CSS3 Fundamentals",
                "JavaScript ES6+",
                "React & Redux",
                "Node.js & Express",
                "Database Design",
                "REST APIs",
                "Authentication & Authorization",
                "Deployment & DevOps"
            ]
        },
        {
            id: 2,
            title: "Machine Learning Masterclass",
            description: "Learn machine learning algorithms and build real-world AI applications",
            instructor: "Dr. Sarah Chen",
            rating: 4.8,
            students: 8560,
            duration: "16 weeks",
            price: 299,
            category: "data-science",
            level: "Advanced",
            modules: 32,
            projects: 12,
            certificate: true,
            tags: ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Deep Learning"],
            syllabus: [
                "Python for Data Science",
                "Statistics & Probability",
                "Supervised Learning",
                "Unsupervised Learning",
                "Neural Networks",
                "Computer Vision",
                "Natural Language Processing",
                "Model Deployment"
            ]
        },
        {
            id: 3,
            title: "UI/UX Design Fundamentals",
            description: "Design beautiful and user-friendly interfaces with modern design principles",
            instructor: "Maria Garcia",
            rating: 4.7,
            students: 9320,
            duration: "8 weeks",
            price: 149,
            category: "design",
            level: "Beginner",
            modules: 16,
            projects: 5,
            certificate: true,
            tags: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping"],
            syllabus: [
                "Design Principles",
                "User Research Methods",
                "Wireframing & Prototyping",
                "Visual Design",
                "Interaction Design",
                "Design Systems",
                "Usability Testing",
                "Portfolio Building"
            ]
        },
        {
            id: 4,
            title: "Mobile App Development",
            description: "Build native and cross-platform mobile applications for iOS and Android",
            instructor: "Michael Brown",
            rating: 4.6,
            students: 7210,
            duration: "10 weeks",
            price: 179,
            category: "mobile",
            level: "Intermediate",
            modules: 20,
            projects: 6,
            certificate: true,
            tags: ["React Native", "Flutter", "iOS", "Android", "Firebase"],
            syllabus: [
                "Mobile Development Basics",
                "React Native Fundamentals",
                "State Management",
                "Native Modules",
                "API Integration",
                "Push Notifications",
                "App Store Deployment",
                "Performance Optimization"
            ]
        },
        {
            id: 5,
            title: "Data Structures & Algorithms",
            description: "Master computer science fundamentals for technical interviews",
            instructor: "David Wilson",
            rating: 4.9,
            students: 15320,
            duration: "6 weeks",
            price: 99,
            category: "programming",
            level: "All Levels",
            modules: 12,
            projects: 3,
            certificate: true,
            tags: ["Algorithms", "Data Structures", "Problem Solving", "Interview Prep"],
            syllabus: [
                "Arrays & Strings",
                "Linked Lists",
                "Stacks & Queues",
                "Trees & Graphs",
                "Sorting Algorithms",
                "Search Algorithms",
                "Dynamic Programming",
                "System Design"
            ]
        },
        {
            id: 6,
            title: "Cloud Computing with AWS",
            description: "Learn cloud infrastructure and services with Amazon Web Services",
            instructor: "Jennifer Lee",
            rating: 4.7,
            students: 5430,
            duration: "14 weeks",
            price: 249,
            category: "cloud",
            level: "Intermediate",
            modules: 28,
            projects: 10,
            certificate: true,
            tags: ["AWS", "Cloud Computing", "DevOps", "Serverless", "Containers"],
            syllabus: [
                "Cloud Fundamentals",
                "EC2 & S3",
                "VPC & Networking",
                "Databases on AWS",
                "Serverless Computing",
                "Container Services",
                "Security & IAM",
                "Cost Optimization"
            ]
        }
    ];
}

// Display Courses
function displayCourses(courses) {
    const coursesGrid = document.getElementById('courses-grid');
    if (!coursesGrid) return;
    
    coursesGrid.innerHTML = courses.map(course => createCourseCard(course)).join('');
    
    // Add event listeners to enroll buttons
    document.querySelectorAll('.course-enroll-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseId = this.dataset.courseId;
            enrollCourse(courseId);
        });
    });
    
    // Add click event to course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.dataset.courseId;
            viewCourseDetails(courseId);
        });
    });
}

// Create Course Card HTML
function createCourseCard(course) {
    const isEnrolled = checkIfEnrolled(course.id);
    
    return `
        <div class="course-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group" data-course-id="${course.id}">
            <div class="relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                     alt="${course.title}"
                     class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500">
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span class="text-sm font-semibold text-gray-800">${course.category}</span>
                </div>
                <div class="absolute bottom-4 left-4">
                    <span class="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold rounded-lg">
                        $${course.price}
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        ${course.level}
                    </span>
                    <div class="flex items-center text-yellow-400">
                        <i class="fas fa-star"></i>
                        <span class="ml-1 text-gray-700 font-semibold">${course.rating}</span>
                    </div>
                </div>
                
                <h3 class="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    ${course.title}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2">
                    ${course.description}
                </p>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center text-gray-600">
                        <i class="fas fa-user-graduate mr-2"></i>
                        <span class="text-sm">${course.students.toLocaleString()}</span>
                    </div>
                    <div class="flex items-center text-gray-600">
                        <i class="far fa-clock mr-2"></i>
                        <span class="text-sm">${course.duration}</span>
                    </div>
                </div>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <div class="w-8 h-8 bg-gray-200 rounded-full overflow-hidden mr-2">
                            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Instructor" class="w-full h-full object-cover">
                        </div>
                        <span class="text-sm text-gray-700">${course.instructor}</span>
                    </div>
                    
                    <button class="course-enroll-btn px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isEnrolled ? 'bg-green-100 text-green-700 cursor-default' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}"
                            data-course-id="${course.id}"
                            ${isEnrolled ? 'disabled' : ''}>
                        ${isEnrolled ? '<i class="fas fa-check mr-2"></i>Enrolled' : 'Enroll Now'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Check if user is enrolled in course
function checkIfEnrolled(courseId) {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    return enrolledCourses.includes(courseId);
}

// Highlight enrolled courses
function highlightEnrolledCourses() {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    enrolledCourses.forEach(courseId => {
        const enrollBtn = document.querySelector(`[data-course-id="${courseId}"]`);
        if (enrollBtn) {
            enrollBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Enrolled';
            enrollBtn.classList.add('bg-green-100', 'text-green-700');
            enrollBtn.classList.remove('bg-blue-100', 'text-blue-600', 'hover:bg-blue-200');
            enrollBtn.disabled = true;
        }
    });
}

// Course Search
function initCourseSearch() {
    const searchInput = document.getElementById('course-search');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performCourseSearch);
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performCourseSearch();
            }
        });
        
        // Real-time search
        searchInput.addEventListener('input', debounce(performCourseSearch, 300));
    }
}

function performCourseSearch() {
    const searchInput = document.getElementById('course-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const courses = getCourses();
    
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.instructor.toLowerCase().includes(searchTerm) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    displayCourses(filteredCourses);
}

// Course Filters
function initCourseFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const levelFilter = document.getElementById('level-filter');
    const priceFilter = document.getElementById('price-filter');
    
    // Category filters
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            applyFilters();
        });
    });
    
    // Level filter
    if (levelFilter) {
        levelFilter.addEventListener('change', applyFilters);
    }
    
    // Price filter
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const activeCategory = document.querySelector('.category-filter.active');
    const category = activeCategory ? activeCategory.dataset.category : 'all';
    const levelFilter = document.getElementById('level-filter');
    const priceFilter = document.getElementById('price-filter');
    
    const level = levelFilter ? levelFilter.value : 'all';
    const price = priceFilter ? priceFilter.value : 'all';
    
    const courses = getCourses();
    
    let filteredCourses = courses;
    
    // Filter by category
    if (category !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    // Filter by level
    if (level !== 'all') {
        filteredCourses = filteredCourses.filter(course => course.level.toLowerCase() === level);
    }
    
    // Filter by price
    if (price === 'free') {
        filteredCourses = filteredCourses.filter(course => course.price === 0);
    } else if (price === 'paid') {
        filteredCourses = filteredCourses.filter(course => course.price > 0);
    }
    
    displayCourses(filteredCourses);
}

// Enroll in Course
function enrollCourse(courseId) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        showToast('Please login to enroll in courses', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    let enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
    
    if (!enrolledCourses.includes(parseInt(courseId))) {
        enrolledCourses.push(parseInt(courseId));
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
        
        // Update UI
        const enrollBtn = document.querySelector(`[data-course-id="${courseId}"]`);
        if (enrollBtn) {
            enrollBtn.innerHTML = '<i class="fas fa-check mr-2"></i>Enrolled';
            enrollBtn.classList.add('bg-green-100', 'text-green-700');
            enrollBtn.classList.remove('bg-blue-100', 'text-blue-600', 'hover:bg-blue-200');
            enrollBtn.disabled = true;
        }
        
        showToast('Successfully enrolled in course!', 'success');
        
        // Add to recent activity
        addToRecentActivity({
            type: 'enrollment',
            courseId: courseId,
            timestamp: new Date().toISOString()
        });
    } else {
        showToast('You are already enrolled in this course', 'info');
    }
}

// View Course Details
function viewCourseDetails(courseId) {
    const course = getCourses().find(c => c.id === parseInt(courseId));
    if (!course) return;
    
    // Store course in localStorage for detail page
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    
    // In a real app, navigate to course detail page
    // For now, show a modal
    showCourseModal(course);
}

// Show Course Modal
function showCourseModal(course) {
    // Create modal HTML
    const modalHTML = `
        <div class="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 modal-overlay active">
            <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="sticky top-0 bg-white z-10 p-6 border-b flex justify-between items-center">
                    <h3 class="text-2xl font-bold">${course.title}</h3>
                    <button class="close-modal text-gray-500 hover:text-gray-700 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="p-6">
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div class="lg:col-span-2">
                            <div class="aspect-video bg-gray-900 rounded-xl mb-6"></div>
                            
                            <div class="mb-8">
                                <h4 class="text-xl font-bold mb-4">Course Description</h4>
                                <p class="text-gray-700">${course.description}</p>
                            </div>
                            
                            <div class="mb-8">
                                <h4 class="text-xl font-bold mb-4">What You'll Learn</h4>
                                <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    ${course.syllabus.map(item => `
                                        <li class="flex items-center">
                                            <i class="fas fa-check text-green-500 mr-3"></i>
                                            <span>${item}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                        
                        <div class="space-y-6">
                            <div class="bg-gray-50 p-6 rounded-xl">
                                <div class="text-3xl font-bold mb-2">$${course.price}</div>
                                <button class="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300 mb-4">
                                    Enroll Now
                                </button>
                                <button class="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                    Add to Wishlist
                                </button>
                            </div>
                            
                            <div class="space-y-4">
                                <div class="flex items-center">
                                    <i class="fas fa-play-circle text-blue-500 mr-3 text-xl"></i>
                                    <div>
                                        <p class="font-medium">${course.modules} Modules</p>
                                        <p class="text-sm text-gray-600">Video lessons</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center">
                                    <i class="fas fa-tasks text-green-500 mr-3 text-xl"></i>
                                    <div>
                                        <p class="font-medium">${course.projects} Projects</p>
                                        <p class="text-sm text-gray-600">Hands-on practice</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center">
                                    <i class="fas fa-certificate text-yellow-500 mr-3 text-xl"></i>
                                    <div>
                                        <p class="font-medium">Certificate</p>
                                        <p class="text-sm text-gray-600">Upon completion</p>
                                    </div>
                                </div>
                                
                                <div class="flex items-center">
                                    <i class="fas fa-infinity text-purple-500 mr-3 text-xl"></i>
                                    <div>
                                        <p class="font-medium">Lifetime Access</p>
                                        <p class="text-sm text-gray-600">Learn at your own pace</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    
    // Enroll button in modal
    const enrollBtn = modalContainer.querySelector('.bg-gradient-to-r');
    if (enrollBtn) {
        enrollBtn.addEventListener('click', () => {
            enrollCourse(course.id);
            document.body.removeChild(modalContainer);
        });
    }
}

// Add to Recent Activity
function addToRecentActivity(activity) {
    let recentActivities = JSON.parse(localStorage.getItem('recentActivities')) || [];
    recentActivities.unshift(activity);
    
    // Keep only last 10 activities
    recentActivities = recentActivities.slice(0, 10);
    
    localStorage.setItem('recentActivities', JSON.stringify(recentActivities));
}

// Setup Course Events
function setupCourseEvents() {
    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sort-courses');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortCourses);
    }
}

// Reset Filters
function resetFilters() {
    // Reset category filters
    document.querySelectorAll('.category-filter').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Reset level filter
    const levelFilter = document.getElementById('level-filter');
    if (levelFilter) levelFilter.value = 'all';
    
    // Reset price filter
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) priceFilter.value = 'all';
    
    // Reset search
    const searchInput = document.getElementById('course-search');
    if (searchInput) searchInput.value = '';
    
    // Show all courses
    displayCourses(getCourses());
}

// Sort Courses
function sortCourses() {
    const sortSelect = document.getElementById('sort-courses');
    if (!sortSelect) return;
    
    const sortBy = sortSelect.value;
    const courses = getCourses();
    
    let sortedCourses = [...courses];
    
    switch(sortBy) {
        case 'price-low':
            sortedCourses.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedCourses.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            sortedCourses.sort((a, b) => b.rating - a.rating);
            break;
        case 'students':
            sortedCourses.sort((a, b) => b.students - a.students);
            break;
        case 'duration':
            sortedCourses.sort((a, b) => {
                const aDuration = parseInt(a.duration);
                const bDuration = parseInt(b.duration);
                return aDuration - bDuration;
            });
            break;
        default:
            // Default sorting (by ID)
            sortedCourses.sort((a, b) => a.id - b.id);
    }
    
    displayCourses(sortedCourses);
}

// Load Course Details (for course detail page)
function loadCourseDetails() {
    // Check if we're on a course detail page
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    
    if (courseId) {
        const course = getCourses().find(c => c.id === parseInt(courseId));
        if (course) {
            displayCourseDetails(course);
        }
    }
}

// Display Course Details
function displayCourseDetails(course) {
    // Update page title
    document.title = `${course.title} - LearnHub`;
    
    // Update course details in the page
    const courseTitle = document.getElementById('course-title');
    const courseDescription = document.getElementById('course-description');
    const courseInstructor = document.getElementById('course-instructor');
    const courseRating = document.getElementById('course-rating');
    const courseStudents = document.getElementById('course-students');
    const courseDuration = document.getElementById('course-duration');
    const courseLevel = document.getElementById('course-level');
    const coursePrice = document.getElementById('course-price');
    
    if (courseTitle) courseTitle.textContent = course.title;
    if (courseDescription) courseDescription.textContent = course.description;
    if (courseInstructor) courseInstructor.textContent = `By ${course.instructor}`;
    if (courseRating) courseRating.textContent = course.rating;
    if (courseStudents) courseStudents.textContent = `${course.students.toLocaleString()} students`;
    if (courseDuration) courseDuration.textContent = course.duration;
    if (courseLevel) courseLevel.textContent = course.level;
    if (coursePrice) coursePrice.textContent = `$${course.price}`;
    
    // Generate syllabus
    const syllabusContainer = document.getElementById('course-syllabus');
    if (syllabusContainer) {
        syllabusContainer.innerHTML = course.syllabus.map((item, index) => `
            <div class="flex items-center p-4 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span class="text-blue-600 font-bold">${index + 1}</span>
                </div>
                <span>${item}</span>
            </div>
        `).join('');
    }
}

// Debounce function for search
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

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium shadow-lg z-50 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`;
    toast.textContent = message;
    toast.style.animation = 'slideInRight 0.3s ease-out';
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initCoursePage,
        getCourses,
        enrollCourse,
        checkIfEnrolled
    };
}