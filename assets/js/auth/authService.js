// const USER = localStorage.getItem('currentUser') || null;

export const authService = {

    isAuthenticated(){
        return !!this.getUser(); // Devuelve true si USER existe, false si no
    },
    getUser(){
        return JSON.parse(localStorage.getItem('currentUser'));
    },
    login(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
    },
    logout(){
        localStorage.removeItem('currentUser');
        localStorage.removeItem('hasSeenFirstPurchasePopup');   
    },
    getAvatar(){
        const user = this.getUser();
        if (!user) return 'U';
        
        const nombreCompleto = user.nombre_completo;
        if (!nombreCompleto) return 'U';
        
        // Handle Google users who might have picture
        if (user.picture) {
            return null; // Return null to use image instead
        }
        
        const nameParts = nombreCompleto.split(' ');
        if (nameParts.length >= 2) { //Retornando las iniciales
            const iniciales = nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0);
            return iniciales.toUpperCase();
        } else {
            // Single name or email
            return nombreCompleto.charAt(0).toUpperCase();
        }
    },
    getLanguage(){
        return localStorage.getItem('userLanguage') || 'ES';
    },
    async validateLogin(username, password) {
        const url = window.location.href;
        const urlCategoria = url.split('/');
        let PATH = '';
        
        // Better path calculation
        if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog') {
            PATH = '../../../';
        } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN') {
            PATH = '../';
        } else {
            PATH = './';
        }
        
        const jsonPath = `${PATH}assets/data/users.json`;
        console.log('Loading users from:', jsonPath + ' ' + PATH);

        let finderUser;

        async function fetchUsers() {
            try {
                const response = await fetch(jsonPath);
                
                if (!response.ok) {
                    console.error('Failed to fetch users.json:', response.status, response.statusText);
                    return false;
                }
                // validacion de usuarios si existen.
                const users = await response.json();
                console.log('Users loaded:', users.length, 'users found');

                const user = users.find(user => 
                    user.username === username && 
                    user.password === password
                );

                if (user) {
                    console.log('User found:', user.username, 'Role:', user.rol);
                    console.log('Login successful:', user.username);

                    localStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        username: user.username,
                        rol: user.rol, // Save as 'rol' to match users.json
                        role: user.rol, // Also save as 'role' for compatibility
                        nombre_completo: user.nombre_completo,
                        email: user.email
                    }));

                    return true;
                }

                console.log('User not found or password incorrect');
                return false;
            } catch (error) {
                console.error('Error fetching users:', error);
                return false;
            }
        }
        
        finderUser = await fetchUsers();
        return finderUser;
    }

    
    

}
