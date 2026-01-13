// API Base URL
const API_BASE = 'http://localhost:3002';

// Check admin authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    initializeMobileMenu();
    initializeNavigation();
});

// Admin Authentication Check
function checkAdminAccess() {
    const currentUser = localStorage.getItem('currentUser');
    console.log('Current user from localStorage:', currentUser);
    
    // TEMPORARY: Admin bypass for testing - remove this in production!
    if (window.location.search.includes('bypass=admin')) {
        console.log('Admin bypass activated');
        const testAdmin = {
            id: 1,
            username: 'test-admin',
            rol: 'admin',
            role: 'admin',
            nombre_completo: 'Test Admin'
        };
        showDashboard();
        loadUserInfo(testAdmin);
        fetchDashboardData();
        return;
    }
    
    if (!currentUser) {
        console.log('No user found in localStorage');
        showAccessDenied();
        return;
    }

    try {
        const userData = JSON.parse(currentUser);
        console.log('Parsed user data:', userData);
        console.log('User role (rol):', userData.rol);
        console.log('User role (role):', userData.role);
        
        // Check if user has admin role (check both fields for compatibility)
        const isAdmin = userData.rol === 'admin' || userData.role === 'admin';
        console.log('Is admin?', isAdmin);
        
        if (!isAdmin) {
            console.log('User is not admin, showing access denied');
            showAccessDenied();
            return;
        }

        // User is admin, show dashboard
        console.log('User is admin, showing dashboard');
        showDashboard();
        loadUserInfo(userData);
        fetchDashboardData();
        
    } catch (error) {
        console.error('Error parsing user data:', error);
        showAccessDenied();
    }
}

// Show access denied screen
function showAccessDenied() {
    document.getElementById('access-denied').classList.remove('hidden');
    document.getElementById('dashboard-layout').classList.add('hidden');
}

// Show dashboard for admin users
function showDashboard() {
    document.getElementById('access-denied').classList.add('hidden');
    document.getElementById('dashboard-layout').classList.remove('hidden');
}

// Load user information in sidebar
function loadUserInfo(userData) {
    const userNameElement = document.getElementById('user-name');
    const userAvatarElement = document.getElementById('user-avatar');
    
    if (userNameElement) {
        userNameElement.textContent = userData.username || 'Admin';
    }
    
    if (userAvatarElement && userData.username) {
        // Show first letter of username in avatar
        const firstLetter = userData.username.charAt(0).toUpperCase();
        userAvatarElement.innerHTML = firstLetter;
    }
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('is-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile && !isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('is-open')) {
                sidebar.classList.remove('is-open');
            }
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
                sidebar.classList.remove('is-open');
            }
        });
    }
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Here you can add page switching logic
            const page = this.getAttribute('data-page');
            console.log('Navigating to:', page);
            
            // Close mobile menu after navigation
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('is-open');
            }
        });
    });
}

// Logout functionality
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = '../../../ES/index.html';
}

// Redirect to home
function redirectToHome() {
    window.location.href = '../../../ES/index.html';
}

// Dashboard data fetching
async function fetchDashboardData() {
    try {
        // Show loading
        document.getElementById('loading').style.display = 'block';
        document.getElementById('error').classList.add('hidden');

        // Fetch data from different endpoints
        const [productsResponse, categoriesResponse, usersResponse, ordersResponse] = await Promise.all([
            fetch(`${API_BASE}/products`),
            fetch(`${API_BASE}/categories`),
            fetch(`${API_BASE}/users`),
            fetch(`${API_BASE}/orders`)
        ]);

        // Check if all responses are ok
        const responses = [productsResponse, categoriesResponse, usersResponse, ordersResponse];
        for (let response of responses) {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to fetch data`);
            }
        }

        // Parse JSON data
        const products = await productsResponse.json();
        const categories = await categoriesResponse.json();
        const users = await usersResponse.json();
        const orders = await ordersResponse.json();

        // Update dashboard counts
        document.getElementById('products-count').textContent = products.length;
        document.getElementById('categories-count').textContent = categories.length;
        document.getElementById('users-count').textContent = users.length;
        document.getElementById('orders-count').textContent = orders.length;

        // Hide loading
        document.getElementById('loading').style.display = 'none';

    } catch (error) {
        console.error('Dashboard Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').classList.remove('hidden');
    }
}

// Refresh data every 30 seconds
setInterval(() => {
    // Only refresh if dashboard is visible (user is admin)
    if (!document.getElementById('dashboard-layout').classList.contains('hidden')) {
        fetchDashboardData();
    }
}, 30000);

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768) {
        sidebar.classList.remove('is-open');
    }
});
