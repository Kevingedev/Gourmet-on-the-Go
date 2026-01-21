// ======================================================================
//  USERS.JS — Gestión completa de usuarios con modales premium
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3005/users";

    // ======================================================================
    //  REFERENCIAS DEL DOM
    // ======================================================================

    const tabla = document.querySelector("#tabla-usuarios tbody");

    // NUEVO — Referencias del modal Crear/Editar
    const userModal = document.getElementById("userModal");
    const userModalTitle = document.getElementById("userModalTitle");
    const closeUserModal = document.getElementById("closeUserModal");
    const userForm = document.getElementById("userForm");

    // NUEVO — Referencias del modal Eliminar
    const deleteUserModal = document.getElementById("deleteUserModal");
    const closeDeleteUserModal = document.getElementById("closeDeleteUserModal");
    const cancelDeleteUser = document.getElementById("cancelDeleteUser");
    const confirmDeleteUser = document.getElementById("confirmDeleteUser");
    const deleteUserName = document.getElementById("deleteUserName");

    const btnNuevo = document.getElementById("btn-nuevo");

    let editando = false;
    let usuarioId = null;
    let userToDelete = null;

    // ======================================================================
    //  CARGAR USUARIOS
    // ======================================================================
    async function cargarUsuarios() {
        const res = await fetch(API_URL);
        const data = await res.json();

        tabla.innerHTML = data.map(user => `
            <tr>
                <td data-label="ID">${user.id}</td>
                <td data-label="Usuario">${user.username}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Rol">
                    <span class="${user.rol === "admin" ? "badge-success" : "badge-warning"}">
                        ${user.rol}
                    </span>
                </td>
                <td data-label="Acciones">
                    <button class="action-btn edit" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${user.id}" data-username="${user.username}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        activarBotones();
    }
    window.cerrarAlertModal = function () {
        document.getElementById("alertModal").style.display = "none";
    };

    // ======================================================================
    //  ACTIVAR BOTONES
    // ======================================================================
    function activarBotones() {

        // Editar
        document.querySelectorAll(".action-btn.edit").forEach(btn => {
            btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id));
        });

        // Eliminar
        document.querySelectorAll(".action-btn.delete").forEach(btn => {
            btn.addEventListener("click", () => {
                abrirModalEliminar(btn.dataset.id, btn.dataset.username);
            });
        });
    }

    // ======================================================================
    //  NUEVO — MODAL CREAR NUEVO USUARIO
    // ======================================================================
    btnNuevo.addEventListener("click", () => {
        editando = false;
        usuarioId = null;

        userModalTitle.textContent = "Nuevo Usuario";
        userForm.reset();

        userModal.style.display = "block";
    });

    // NUEVO — Cerrar modal Crear/Editar
    closeUserModal.addEventListener("click", () => {
        userModal.style.display = "none";
    });

    // ======================================================================
    //  NUEVO — MODAL EDITAR USUARIO
    // ======================================================================
    async function abrirModalEditar(id) {
        editando = true;
        usuarioId = id;

        const res = await fetch(`${API_URL}/${id}`);
        const user = await res.json();

        userModalTitle.textContent = "Editar Usuario";

        userForm.username.value = user.username;
        userForm.email.value = user.email;
        userForm.nombre_completo.value = user.nombre_completo;
        userForm.password.value = user.password;
        userForm.rol.value = user.rol;

        userModal.style.display = "block";
    }

    // ======================================================================
    //  NUEVO — GUARDAR USUARIO (CREAR O EDITAR)
    // ======================================================================
    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            username: userForm.username.value,
            email: userForm.email.value,
            nombre_completo: userForm.nombre_completo.value,
            password: userForm.password.value,
            rol: userForm.rol.value,
            fecha_registro: new Date().toISOString().slice(0, 10),
            provider: "local"
        };

        const method = editando ? "PUT" : "POST";
        const url = editando ? `${API_URL}/${usuarioId}` : API_URL;

        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        userModal.style.display = "none";
        cargarUsuarios();
    });

    // ======================================================================
    //  🟦 NUEVO — MODAL ELIMINAR USUARIO
    // ======================================================================
    function abrirModalEliminar(id, username) {

        // PROTECCIÓN SUPERADMIN
        if (id === "1" || username.toLowerCase() === "superadmin") {
            document.getElementById("alertModal").style.display = "block";
            return;
        }

        userToDelete = id;
        deleteUserName.textContent = username;

        deleteUserModal.style.display = "block";
    }

    function cerrarAlertModal() {
        document.getElementById("alertModal").style.display = "none";
    }

    closeDeleteUserModal.addEventListener("click", () => {
        deleteUserModal.style.display = "none";
    });

    cancelDeleteUser.addEventListener("click", () => {
        deleteUserModal.style.display = "none";
    });

    confirmDeleteUser.addEventListener("click", async () => {
        await fetch(`${API_URL}/${userToDelete}`, { method: "DELETE" });
        deleteUserModal.style.display = "none";
        cargarUsuarios();
    });



    // ======================================================================
    //  INICIAR
    // ======================================================================
    cargarUsuarios();
});
