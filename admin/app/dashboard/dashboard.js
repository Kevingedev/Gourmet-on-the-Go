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
    
    // TEMPORARY: Admin bypass for testing - remove this in production!
    if (window.location.search.includes('bypass=admin') || !currentUser) {
        console.log('Admin bypass activated - creating test admin user');
        const testAdmin = {
            id: 1,
            username: 'admin',
            nombre_completo: 'Admin User',
            email: 'admin@admin.com',
            rol: 'admin',
            role: 'admin'
        };
        localStorage.setItem('currentUser', JSON.stringify(testAdmin));
        console.log('Test admin user created and saved to localStorage');
        // Reload the page to pick up the new user data
        window.location.reload();
        return;
    }
    
    if (!currentUser) {
        console.log('No user found in localStorage - redirecting to home');
        redirectToHome();
        return;
    }

    try {
        const userData = JSON.parse(currentUser);
        console.log('Parsed user data:', userData);
        console.log('All user properties:', Object.keys(userData));
        console.log('User role (rol):', userData.rol);
        console.log('User role (role):', userData.role);
        console.log('User role (admin):', userData.admin);
        console.log('User role (userType):', userData.userType);
        
        // Check if user has admin role (check multiple possible fields)
        const isAdmin = userData.rol === 'admin' || 
                        userData.role === 'admin' || 
                        userData.admin === true || 
                        userData.userType === 'admin';
        console.log('Is admin?', isAdmin);
        
        if (!isAdmin) {
            console.log('User is not admin, redirecting to home');
            redirectToHome();
            return;
        }

        // User is admin, show dashboard
        console.log('User is admin, loading dashboard');
        loadUserInfo(userData);
        fetchDashboardData();
        
    } catch (error) {
        console.error('Error parsing user data:', error);
        redirectToHome();
    }
}

// Show access denied screen
function showAccessDenied() {
    const accessDenied = document.getElementById('access-denied');
    const dashboardLayout = document.getElementById('dashboard-layout');
    
    console.log('showAccessDenied called');
    console.log('access-denied element:', accessDenied);
    console.log('dashboard-layout element:', dashboardLayout);
    
    if (accessDenied) {
        accessDenied.classList.remove('hidden');
        console.log('Removed hidden from access-denied');
    } else {
        console.log('access-denied element not found (dashboard may not use access denied screen)');
    }
    
    if (dashboardLayout) {
        dashboardLayout.classList.add('hidden');
        console.log('Added hidden to dashboard-layout');
    } else {
        console.error('dashboard-layout element not found - this is the problem!');
    }
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
        console.log('access-denied element not found (dashboard may not use access denied screen)');
    }
    
    if (dashboardLayout) {
        dashboardLayout.classList.remove('hidden');
        console.log('Removed hidden from dashboard-layout');
    } else {
        console.error('dashboard-layout element not found - this is the problem!');
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
    // Get user's preferred language and redirect accordingly
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    window.location.href = `../../../${userLanguage}/index.html`;
}

// Redirect to home
function redirectToHome() {
    // Get user's preferred language and redirect accordingly
    const userLanguage = localStorage.getItem('userLanguage') || 'ES';
    window.location.href = `../../../${userLanguage}/index.html`;
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

        // Populate data lists
        populateProductsList(products);
        populateCategoriesList(categories);
        populateUsersList(users);
        populateOrdersList(orders);

        // Hide loading
        document.getElementById('loading').style.display = 'none';

    } catch (error) {
        console.error('Dashboard Error:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').classList.remove('hidden');
    }
}

// Populate products list
function populateProductsList(products) {
    const productsList = document.getElementById('products-list');
    
    if (!products || products.length === 0) {
        productsList.innerHTML = '<div class="no-data">No hay productos disponibles</div>';
        return;
    }

    // Show first 5 products
    const recentProducts = products.slice(0, 5);
    
    productsList.innerHTML = recentProducts.map(product => {
        // Extract data from the actual API structure
        const name = product.nombre ? product.nombre.ES || product.nombre.EN || 'Sin nombre' : 'Sin nombre';
        const description = product.descripcion ? product.descripcion.ES || product.descripcion.EN || 'Sin descripción' : 'Sin descripción';
        const price = product.precio ? `$${product.precio}` : '';
        const id = product.id_producto || product.id || 'N/A';
        
        return `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${name}</h3>
                <p>ID: ${id} | ${description} ${price ? `- ${price}` : ''}</p>
            </div>
        </div>
    `;
    }).join('');
}

// Populate categories list
function populateCategoriesList(categories) {
    const categoriesList = document.getElementById('categories-list');
    
    if (!categories || categories.length === 0) {
        categoriesList.innerHTML = '<div class="no-data">No hay categorías disponibles</div>';
        return;
    }

    categoriesList.innerHTML = categories.map(category => {
        const name = category.nombre ? category.nombre.ES || category.nombre.EN || 'Sin nombre' : 'Sin nombre';
        const description = category.descripcion ? category.descripcion.ES || category.descripcion.EN || 'Sin descripción' : 'Sin descripción';
        const id = category.id_categoria || category.id || 'N/A';
        
        return `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${name}</h3>
                <p>ID: ${id} | ${description}</p>
            </div>
        </div>
    `;
    }).join('');
}

// Populate users list
function populateUsersList(users) {
    const usersList = document.getElementById('users-list');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = '<div class="no-data">No hay usuarios disponibles</div>';
        return;
    }

    // Show first 5 users
    const recentUsers = users.slice(0, 5);
    
    usersList.innerHTML = recentUsers.map(user => {
        const name = user.nombre_completo || user.username || user.name || 'Sin nombre';
        const email = user.email || 'Sin email';
        const role = user.rol || user.role || 'Sin rol';
        const id = user.id || 'N/A';
        
        return `
        <div class="data-item">
            <div class="data-item-info">
                <h3>${name}</h3>
                <p>ID: ${id} | ${email} | Rol: ${role}</p>
            </div>
        </div>
    `;
    }).join('');
}

// Populate orders list
function populateOrdersList(orders) {
    const ordersList = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<div class="no-data">No hay pedidos disponibles</div>';
        return;
    }

    // Show first 5 orders
    const recentOrders = orders.slice(0, 5);
    
    ordersList.innerHTML = recentOrders.map(order => {
        const id = order.id || order.id_pedido || 'N/A';
        const status = order.estado || order.status || 'Sin estado';
        const total = order.total ? `$${order.total}` : 'Sin total';
        const date = order.fecha || order.date || 'Sin fecha';
        
        return `
        <div class="data-item">
            <div class="data-item-info">
                <h3>Pedido #${id}</h3>
                <p>Fecha: ${date} | Estado: ${status} | Total: ${total}</p>
            </div>
        </div>
    `;
    }).join('');
}

// Placeholder functions for actions
function editProduct(id) {
    console.log('Edit product:', id);
    alert('Editar producto: ' + id);
}

function deleteProduct(id) {
    console.log('Delete product:', id);
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        alert('Producto eliminado: ' + id);
    }
}

function editCategory(id) {
    console.log('Edit category:', id);
    alert('Editar categoría: ' + id);
}

function deleteCategory(id) {
    console.log('Delete category:', id);
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
        alert('Categoría eliminada: ' + id);
    }
}

function editUser(id) {
    console.log('Edit user:', id);
    alert('Editar usuario: ' + id);
}

function deleteUser(id) {
    console.log('Delete user:', id);
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
        alert('Usuario eliminado: ' + id);
    }
}

function viewOrder(id) {
    console.log('View order:', id);
    alert('Ver pedido: ' + id);
}

function deleteOrder(id) {
    console.log('Delete order:', id);
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
        alert('Pedido eliminado: ' + id);
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
