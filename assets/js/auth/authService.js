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
        if (nameParts.length >= 2) {
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
        const PATH = urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' ? '../../../' : '../../';
        // const btnLogin = document.getElementById('btn-login');
        // Logica de Fetch al JSON y la comparación de credenciales para iniciar sesión
        // console.log(`Validando credenciales para: ${username}`);

        const jsonPath = `${PATH}assets/data/users.json`;
        // console.log(jsonPath);

        let finderUser;

        async function fetchUsers() {
            try {
                const response = await fetch(jsonPath);
                const users = await response.json();
                /* console.log(users); */

                const user = users.find(user => user.username === username && user.password === password);

                /* console.log("Encuentra a: " + user); */

                if (user != undefined && user != null && user != '') {
                    // console.log("Encontro al usuario:" + user.username);
                    /* btnLogin.style.display = 'none';
                    btnLogout.style.display = 'block'; */

                    localStorage.setItem('currentUser', JSON.stringify({
                        id: user.id,
                        username: user.username,
                        role: user.role,
                        nombre_completo: user.nombre_completo,
                        email: user.email
                    }));

                    return true;
                }

                /* console.log("No encontro al usuario"); */
                return false;
            } catch (error) {
                console.log(error);
                return false;
            }
        }
        finderUser = await fetchUsers();
        /* console.log("resultado de la funcion fetchUsers: " + finderUser); */
        return finderUser;
    }

    
    

}
