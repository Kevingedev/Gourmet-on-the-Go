// API Base URL
const API_BASE = 'http://localhost:3005';

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
    const accessDenied = document.getElementById('access-denied');
    const dashboardLayout = document.getElementById('dashboard-layout');
    
    console.log('showDashboard called');
    console.log('access-denied element:', accessDenied);
    console.log('dashboard-layout element:', dashboardLayout);
    
    if (accessDenied) {
        accessDenied.classList.add('hidden');
        console.log('Added hidden to access-denied');
    } else {
        console.error('access-denied element not found');
    }
    
    if (dashboardLayout) {
        dashboardLayout.classList.remove('hidden');
        console.log('Removed hidden from dashboard-layout');
    } else {
        console.error('dashboard-layout element not found');
    }
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
        console.log('Starting dashboard data fetch...');
        console.log('API_BASE:', API_BASE);
        
        // Hide error initially
        document.getElementById('error').classList.add('hidden');

        // Fetch data from different endpoints
        console.log('Fetching products...');
        const productsResponse = await fetch(`${API_BASE}/products`);
        console.log('Products response:', productsResponse.status, productsResponse.ok);
        
        console.log('Fetching categories...');
        const categoriesResponse = await fetch(`${API_BASE}/categories`);
        console.log('Categories response:', categoriesResponse.status, categoriesResponse.ok);
        
        console.log('Fetching users...');
        const usersResponse = await fetch(`${API_BASE}/users`);
        console.log('Users response:', usersResponse.status, usersResponse.ok);
        
        console.log('Fetching orders...');
        const ordersResponse = await fetch(`${API_BASE}/orders`);
        console.log('Orders response:', ordersResponse.status, ordersResponse.ok);

        // Check if all responses are ok
        const responses = [productsResponse, categoriesResponse, usersResponse, ordersResponse];
        for (let response of responses) {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: Failed to fetch data from ${response.url}`);
            }
        }

        // Parse JSON data
        const products = await productsResponse.json();
        const categories = await categoriesResponse.json();
        const users = await usersResponse.json();
        const orders = await ordersResponse.json();

        console.log('Data received:', { products, categories, users, orders });

        // Update dashboard counts
        document.getElementById('products-count').textContent = products.length;
        document.getElementById('categories-count').textContent = categories.length;
        document.getElementById('users-count').textContent = users.length;
        document.getElementById('orders-count').textContent = orders.length;

        // Populate data lists
        populateProductsList(products.slice(0, 5)); // Show first 5 products
        populateUsersList(users.slice(0, 5)); // Show first 5 users
        populateCategoriesList(categories.slice(0, 5)); // Show first 5 categories

        // Hide loading
        document.getElementById('loading').style.display = 'none';

    } catch (error) {
        console.error('Dashboard Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').classList.remove('hidden');
        
        // Show error in lists
        showListError('products-list');
        showListError('users-list');
        showListError('categories-list');
    }
}

// Populate products list
function populateProductsList(products) {
    const productsList = document.getElementById('products-list');
    
    if (!products || products.length === 0) {
        productsList.innerHTML = '<div class="no-data">No hay productos disponibles</div>';
        return;
    }

    productsList.innerHTML = products.map(product => `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${product.nombre || product.name || 'Sin nombre'}</h3>
                <p>${product.descripcion || product.description || 'Sin descripción'}</p>
            </div>
            <div class="data-item-actions">
                <button class="btn-action edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Populate users list
function populateUsersList(users) {
    const usersList = document.getElementById('users-list');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = '<div class="no-data">No hay usuarios disponibles</div>';
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${user.username || user.nombre || 'Sin nombre'}</h3>
                <p>${user.email || 'Sin email'} - ${user.rol || user.role || 'user'}</p>
            </div>
            <div class="data-item-actions">
                <button class="btn-action edit" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action delete" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Populate categories list
function populateCategoriesList(categories) {
    const categoriesList = document.getElementById('categories-list');
    
    if (!categories || categories.length === 0) {
        categoriesList.innerHTML = '<div class="no-data">No hay categorías disponibles</div>';
        return;
    }

    categoriesList.innerHTML = categories.map(category => `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${category.nombre || category.name || 'Sin nombre'}</h3>
                <p>${category.descripcion || category.description || 'Sin descripción'}</p>
            </div>
            <div class="data-item-actions">
                <button class="btn-action edit" onclick="editCategory(${category.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn-action delete" onclick="deleteCategory(${category.id})">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

// Show error in list
function showListError(listId) {
    const listElement = document.getElementById(listId);
    listElement.innerHTML = '<div class="no-data">Error al cargar datos</div>';
}

// Action functions (placeholders for now)
function editProduct(id) {
    console.log('Edit product:', id);
    // TODO: Implement edit product functionality
}

function deleteProduct(id) {
    console.log('Delete product:', id);
    // TODO: Implement delete product functionality
}

function editUser(id) {
    console.log('Edit user:', id);
    // TODO: Implement edit user functionality
}

function deleteUser(id) {
    console.log('Delete user:', id);
    // TODO: Implement delete user functionality
}

function editCategory(id) {
    console.log('Edit category:', id);
    // TODO: Implement edit category functionality
}

function deleteCategory(id) {
    console.log('Delete category:', id);
    // TODO: Implement delete category functionality
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
