/* admin/components/SideBar.js */
const Sidebar = {
    menuItems: [
        { label: 'Dashboard', icon: 'fas fa-chart-line', link: '../dashboard/' },
        { label: 'Products', icon: 'fas fa-box', link: '../products/' },
        { label: 'Orders', icon: 'fas fa-shopping-cart', link: '../orders/' },
        { label: 'Users', icon: 'fas fa-users', link: '../users/' },
        { label: 'Categories', icon: 'fas fa-users', link: '../categories/' },
        { label: 'Settings', icon: 'fas fa-cog', link: '../settings/' }
    ],

    getCurrentPage: function() {
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/dashboard/')) return 'dashboard';
        if (currentPath.includes('/products/')) return 'products';
        if (currentPath.includes('/orders/')) return 'orders';
        if (currentPath.includes('/users/')) return 'users';
        if (currentPath.includes('/categories/')) return 'categories';
        if (currentPath.includes('/settings/')) return 'settings';
        
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
            else if (item.link.includes('/categories/') && currentPage === 'categories') isActive = true;
            else if (item.link.includes('/settings/') && currentPage === 'settings') isActive = true;
            
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
