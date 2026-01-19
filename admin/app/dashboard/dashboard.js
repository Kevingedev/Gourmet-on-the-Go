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

    let showingAll = false;
    const initialCount = 4;
    
    function renderProducts() {
        const productsToShow = showingAll ? products : products.slice(0, initialCount);
        
        const productsHTML = productsToShow.map(product => {
            // Extract data from the actual API structure
            const name = product.nombre ? product.nombre.ES || product.nombre.EN || 'Sin nombre' : 'Without name';
            const description = product.descripcion ? product.descripcion.ES || product.descripcion.EN || 'Sin descripción' : 'Without Description';
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
        
        // Add show more/less button if there are more products than initial count
        let buttonHTML = '';
        if (products.length > initialCount) {
            buttonHTML = `
                <div class="data-item show-more-container">
                    <button class="btn-action show-more-btn" id="toggle-products">
                        ${showingAll ? 'Mostrar menos' : 'Mostrar más'}
                        <i class="fas fa-chevron-${showingAll ? 'up' : 'down'}"></i>
                    </button>
                </div>
            `;
        }
        
        productsList.innerHTML = productsHTML + buttonHTML;
        
        // Add event listener to the toggle button
        const toggleBtn = document.getElementById('toggle-products');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                showingAll = !showingAll;
                renderProducts();
            });
        }
    }
    
    // Initial render
    renderProducts();
}

// Populate categories list
function populateCategoriesList(categories) {
    const categoriesList = document.getElementById('categories-list');
    
    if (!categories || categories.length === 0) {
        categoriesList.innerHTML = '<div class="no-data">No hay categorías disponibles</div>';
        return;
    }

    let showingAll = false;
    const initialCount = 4;
    
    function renderCategories() {
        const categoriesToShow = showingAll ? categories : categories.slice(0, initialCount);
        
        const categoriesHTML = categoriesToShow.map(category => {
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
        
        // Add show more/less button if there are more categories than initial count
        let buttonHTML = '';
        if (categories.length > initialCount) {
            buttonHTML = `
                <div class="data-item show-more-container">
                    <button class="btn-action show-more-btn" id="toggle-categories">
                        ${showingAll ? 'Mostrar menos' : 'Mostrar más'}
                        <i class="fas fa-chevron-${showingAll ? 'up' : 'down'}"></i>
                    </button>
                </div>
            `;
        }
        
        categoriesList.innerHTML = categoriesHTML + buttonHTML;
        
        // Add event listener to the toggle button
        const toggleBtn = document.getElementById('toggle-categories');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                showingAll = !showingAll;
                renderCategories();
            });
        }
    }
    
    // Initial render
    renderCategories();
}

// Populate users list
function populateUsersList(users) {
    const usersList = document.getElementById('users-list');
    
    if (!users || users.length === 0) {
        usersList.innerHTML = '<div class="no-data">No hay usuarios disponibles</div>';
        return;
    }

    let showingAll = false;
    const initialCount = 5;
    
    function renderUsers() {
        const usersToShow = showingAll ? users : users.slice(0, initialCount);
        
        const usersHTML = usersToShow.map(user => {
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
        
        // Add show more/less button if there are more users than initial count
        let buttonHTML = '';
        if (users.length > initialCount) {
            buttonHTML = `
                <div class="data-item show-more-container">
                    <button class="btn-action show-more-btn" id="toggle-users">
                        ${showingAll ? 'Mostrar menos' : 'Mostrar más'}
                        <i class="fas fa-chevron-${showingAll ? 'up' : 'down'}"></i>
                    </button>
                </div>
            `;
        }
        
        usersList.innerHTML = usersHTML + buttonHTML;
        
        // Add event listener to the toggle button
        const toggleBtn = document.getElementById('toggle-users');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                showingAll = !showingAll;
                renderUsers();
            });
        }
    }
    
    // Initial render
    renderUsers();
}

// Populate orders list
function populateOrdersList(orders) {
    const ordersList = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        ordersList.innerHTML = '<div class="no-data">No hay pedidos disponibles</div>';
        return;
    }

    let showingAll = false;
    const initialCount = 5;
    
    function renderOrders() {
        const ordersToShow = showingAll ? orders : orders.slice(0, initialCount);
        
        const ordersHTML = ordersToShow.map(order => {
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
        
        // Add show more/less button if there are more orders than initial count
        let buttonHTML = '';
        if (orders.length > initialCount) {
            buttonHTML = `
                <div class="data-item show-more-container">
                    <button class="btn-action show-more-btn" id="toggle-orders">
                        ${showingAll ? 'Mostrar menos' : 'Mostrar más'}
                        <i class="fas fa-chevron-${showingAll ? 'up' : 'down'}"></i>
                    </button>
                </div>
            `;
        }
        
        ordersList.innerHTML = ordersHTML + buttonHTML;
        
        // Add event listener to the toggle button
        const toggleBtn = document.getElementById('toggle-orders');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                showingAll = !showingAll;
                renderOrders();
            });
        }
    }
    
    // Initial render
    renderOrders();
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
