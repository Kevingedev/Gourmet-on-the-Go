document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3005/users";

    const tabla = document.querySelector("#tabla-usuarios tbody");
    const modal = document.getElementById("modal");
    const form = document.getElementById("form-usuario");
    const btnNuevo = document.getElementById("btn-nuevo");
    const btnCerrar = document.getElementById("btn-cerrar");
    const modalTitle = document.getElementById("modal-title");

    let editando = false;
    let usuarioId = null;

    async function cargarUsuarios() {
        const res = await fetch(API_URL);
        const data = await res.json();

        tabla.innerHTML = data.map(user => `
            <tr>
                <td data-label="ID">${user.id}</td>
                <td data-label="Usuario">${user.username}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Rol">
                    <span class="badge ${user.rol === "admin" ? "badge-success" : "badge-warning"}">
                        ${user.rol}
                    </span>
                </td>
                <td data-label="Acciones">
                    <button class="action-btn edit" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" data-id="${user.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join("");

        activarBotones();
    }

    function activarBotones() {
        document.querySelectorAll(".action-btn.edit").forEach(btn => {
            btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id));
        });

        document.querySelectorAll(".action-btn.delete").forEach(btn => {
            btn.addEventListener("click", () => borrarUsuario(btn.dataset.id));
        });
    }

    btnNuevo.addEventListener("click", () => {
        editando = false;
        usuarioId = null;
        modalTitle.textContent = "Nuevo Usuario";
        form.reset();
        modal.classList.remove("hidden");
    });

    async function abrirModalEditar(id) {
        editando = true;
        usuarioId = id;

        const res = await fetch(`${API_URL}/${id}`);
        const user = await res.json();

        modalTitle.textContent = "Editar Usuario";

        form.username.value = user.username;
        form.email.value = user.email;
        form.nombre_completo.value = user.nombre_completo;
        form.password.value = user.password;
        form.rol.value = user.rol;

        modal.classList.remove("hidden");
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            username: form.username.value,
            email: form.email.value,
            nombre_completo: form.nombre_completo.value,
            password: form.password.value,
            rol: form.rol.value,
            fecha_registro: new Date().toISOString().slice(0, 10),
            provider: "local"
        };

        const method = editando ? "PUT" : "POST";
        const url = editando ? `${API_URL}/${usuarioId}` : API_URL;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        modal.classList.add("hidden");
        cargarUsuarios();
    });

    async function borrarUsuario(id) {
        if (confirm("¿Eliminar usuario?")) {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            cargarUsuarios();
        }
    }

    btnCerrar.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // INICIAR
    cargarUsuarios();
});
