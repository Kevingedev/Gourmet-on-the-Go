/* admin/components/SideBar.js */
const Sidebar = {
    menuItems: [
        { label: 'Dashboard', icon: 'fas fa-chart-line', link: '../dashboard/index.html' },
        { label: 'Products', icon: 'fas fa-box', link: '../products/index.html' },
        { label: 'Orders', icon: 'fas fa-shopping-cart', link: '../orders/index.html' },
        { label: 'Users', icon: 'fas fa-users', link: '../users/index.html' },
        { label: 'Settings', icon: 'fas fa-cog', link: '#settings' }
    ],

    getCurrentPage: function() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/dashboard/')) return 'dashboard';
        if (currentPath.includes('/products/')) return 'products';
        if (currentPath.includes('/orders/')) return 'orders';
        if (currentPath.includes('/users/')) return 'users';
        
        return 'dashboard'; // default
    },

    init: function () {
        this.render();
    },

    render: function () {
        const sidebarElement = document.getElementById('sidebar');
        if (!sidebarElement) return;

        const currentPage = this.getCurrentPage();
        
        const navItemsHTML = this.menuItems.map(item => {
            // Determine if this item should be active
            let isActive = false;
            
            if (item.link.includes('/dashboard/') && currentPage === 'dashboard') isActive = true;
            else if (item.link.includes('/products/') && currentPage === 'products') isActive = true;
            else if (item.link.includes('/orders/') && currentPage === 'orders') isActive = true;
            else if (item.link.includes('/users/') && currentPage === 'users') isActive = true;
            
            return `
            <li>
                <a href="${item.link}" class="${isActive ? 'active' : ''}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `;
        }).join('');

        sidebarElement.innerHTML = `
            <ul class="sidebar-menu">
                ${navItemsHTML}
            </ul>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => Sidebar.init());
