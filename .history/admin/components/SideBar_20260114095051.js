/* admin/components/SideBar.js */
const Sidebar = {
    menuItems: [
        { label: 'Dashboard', icon: 'fas fa-chart-line', link: '../dashboard/index.html' },
        { label: 'Products', icon: 'fas fa-box', link: '../products/index.html', active: false },
        { label: 'Orders', icon: 'fas fa-shopping-cart', link: '../orders/index.html' },
        { label: 'Users', icon: 'fas fa-users', link: '../users/index.html' },
        { label: 'Settings', icon: 'fas  fa-cog', link: '#settings' }
    ],

    init: function () {
        this.render();
    },

    render: function () {
        const sidebarElement = document.getElementById('sidebar');
        if (!sidebarElement) return;

        const navItemsHTML = this.menuItems.map(item => `
            <li>
                <a href="${item.link}" class="${item.active ? 'active' : ''}">
                    <i class="${item.icon}"></i>
                    <span>${item.label}</span>
                </a>
            </li>
        `).join('');

        sidebarElement.innerHTML = `
            <ul class="sidebar-menu">
                ${navItemsHTML}
            </ul>
        `;
    }
};

document.addEventListener('DOMContentLoaded', () => Sidebar.init());
