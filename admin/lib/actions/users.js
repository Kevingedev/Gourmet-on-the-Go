const API_URL = "http://localhost:3005/users";

// ELEMENTOS DEL DOM
const tabla = document.querySelector("#tabla-usuarios tbody");
const modal = document.getElementById("modal");
const form = document.getElementById("form-usuario");
const btnNuevo = document.getElementById("btn-nuevo");
const btnCerrar = document.getElementById("btn-cerrar");
const modalTitle = document.getElementById("modal-title");

let editando = false;
let usuarioId = null;

// ----------------------
// 1. CARGAR USUARIOS
// ----------------------
async function cargarUsuarios() {
    const res = await fetch(API_URL);
    const data = await res.json();

    tabla.innerHTML = data.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.rol}</td>
      <td>
        <button class="btn-editar" data-id="${user.id}">Editar</button>
        <button class="btn-borrar" data-id="${user.id}">Eliminar</button>
      </td>
    </tr>
  `).join("");

    activarBotones();
}

// ----------------------
// 2. ACTIVAR BOTONES
// ----------------------
function activarBotones() {
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => abrirModalEditar(btn.dataset.id));
    });

    document.querySelectorAll(".btn-borrar").forEach(btn => {
        btn.addEventListener("click", () => borrarUsuario(btn.dataset.id));
    });
}

// ----------------------
// 3. ABRIR MODAL NUEVO
// ----------------------
btnNuevo.addEventListener("click", () => {
    editando = false;
    usuarioId = null;
    modalTitle.textContent = "Nuevo Usuario";
    form.reset();
    modal.classList.remove("hidden");
});

// ----------------------
// 4. ABRIR MODAL EDITAR
// ----------------------
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

// ----------------------
// 5. GUARDAR (POST/PUT)
// ----------------------
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

// ----------------------
// 6. BORRAR USUARIO
// ----------------------
async function borrarUsuario(id) {
    if (confirm("¿Eliminar usuario?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        cargarUsuarios();
    }
}

// ----------------------
// 7. CERRAR MODAL
// ----------------------
btnCerrar.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// ----------------------
// 8. INICIALIZAR
// ----------------------
cargarUsuarios();
