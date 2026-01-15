const API_URL = "http://localhost:3005/orders";
const USERS_URL = "http://localhost:3005/users";

const tabla = document.querySelector("#tabla-pedidos tbody");
const modal = document.getElementById("modal");
const detalle = document.getElementById("detalle-pedido");
const btnCerrar = document.getElementById("btn-cerrar");

// ----------------------
// 1. CARGAR PEDIDOS
// ----------------------
async function cargarPedidos() {
  const res = await fetch(API_URL);
  const pedidos = await res.json();

  tabla.innerHTML = await Promise.all(
    pedidos.map(async (p) => {
      const user = await fetch(`${USERS_URL}/${p.userId}`).then(r => r.json());

      return `
        <tr>
          <td>${p.id}</td>
          <td>${user.username}</td>
          <td>${p.total} €</td>
          <td>${p.date}</td>
          <td>
            <button class="btn-detalle" data-id="${p.id}">Ver</button>
            <button class="btn-borrar" data-id="${p.id}">Eliminar</button>
          </td>
        </tr>
      `;
    })
  ).then(rows => rows.join(""));

  activarBotones();
}

// ----------------------
// 2. ACTIVAR BOTONES
// ----------------------
function activarBotones() {
  document.querySelectorAll(".btn-detalle").forEach(btn => {
    btn.addEventListener("click", () => verDetalle(btn.dataset.id));
  });

  document.querySelectorAll(".btn-borrar").forEach(btn => {
    btn.addEventListener("click", () => borrarPedido(btn.dataset.id));
  });
}

// ----------------------
// 3. VER DETALLE
// ----------------------
async function verDetalle(id) {
  const pedido = await fetch(`${API_URL}/${id}`).then(r => r.json());
  detalle.textContent = JSON.stringify(pedido, null, 2);
  modal.classList.remove("hidden");
}

// ----------------------
// 4. BORRAR PEDIDO
// ----------------------
async function borrarPedido(id) {
  if (confirm("¿Eliminar pedido?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    cargarPedidos();
  }
}

// ----------------------
// 5. CERRAR MODAL
// ----------------------
btnCerrar.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// ----------------------
// 6. INICIALIZAR
// ----------------------
cargarPedidos();