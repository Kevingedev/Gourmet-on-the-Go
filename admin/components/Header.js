/* admin/components/Header.js */
const Header = {
    getUserLanguage: function() {
        return localStorage.getItem('userLanguage') || 'ES';
    },

    init: function () {
        this.render();
        this.bindEvents();
    },

    render: function () {
        const headerElement = document.getElementById('header');
        if (!headerElement) return;

        const userLanguage = this.getUserLanguage();
        
        // Different profile page names for different languages
        const profilePages = {
            'ES': 'perfil.html',
            'EN': 'profile.html',
            'FR': 'profil.html',
            'EU': 'profila.html'
        };
        
        const profilePage = profilePages[userLanguage] || 'perfil.html';
        const profileUrl = `/${userLanguage}/${profilePage}`;

        headerElement.innerHTML = `
            <div class="header-logo">
                
                <span>Gourmet Admin</span>
            </div>
            
            <div class="header-search">
                <div class="search-wrapper">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar productos, pedidos..." id="searchInput">
                </div>
            </div>

            <div class="header-nav">
                <div class="user-dropdown">
                    <div class="user-profile" id="userProfileBtn">
                        <div class="user-avatar">AD</div>
                        <span class="user-name">Admin</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu" id="userDropdownMenu">
                        <a href="${profileUrl}"><i class="fas fa-user-circle"></i> Mi Perfil</a>
                        <a href="#"><i class="fas fa-cog"></i> Configuración</a>
                        <hr>
                        <a href="#" onclick="Header.handleLogout()" class="logout-link">
                            <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </a>
                    </div>
                </div>
            </div>
        `;
    },

    bindEvents: function () {
        const profileBtn = document.getElementById('userProfileBtn');
        const dropdownMenu = document.getElementById('userDropdownMenu');

        if (profileBtn && dropdownMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });
        }
    },

    handleLogout: function () {
        console.log('Logging out...');
        // Add logout logic here
    }
};

document.addEventListener('DOMContentLoaded', () => Header.init());
