const API_URL = "http://localhost:3005/orders";
const USERS_URL = "http://localhost:3005/users";

const tabla = document.querySelector("#tabla-pedidos tbody");
const modal = document.getElementById("modal");
const deleteModal = document.getElementById("deleteModal");
const detalle = document.getElementById("detalle-pedido");
const btnCerrar = document.getElementById("btn-cerrar");
const deleteOrderId = document.getElementById("deleteOrderId");
const btnCerrarDelete = document.getElementById("btn-cerrar-delete");
const btnCancelDelete = document.getElementById("btn-cancel-delete");
const btnConfirmDelete = document.getElementById("btn-confirm-delete");

let orderToDelete = null;

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
  
  // Formatear los detalles del pedido de manera estructurada
  const detalleHTML = `
    <div class="detalle-grupo">
      <div class="detalle-item">
        <label>ID del Pedido:</label>
        <span>${pedido.id}</span>
      </div>
      <div class="detalle-item">
        <label>ID del Usuario:</label>
        <span>${pedido.userId}</span>
      </div>
      <div class="detalle-item">
        <label>ID del Producto:</label>
        <span>${pedido.productId}</span>
      </div>
      <div class="detalle-item">
        <label>Cantidad:</label>
        <span>${pedido.quantity}</span>
      </div>
      <div class="detalle-item">
        <label>Estado:</label>
        <span class="estado-badge ${pedido.status}">${pedido.status}</span>
      </div>
      <div class="detalle-item">
        <label>Fecha del Pedido:</label>
        <span>${new Date(pedido.orderDate).toLocaleString('es-ES')}</span>
      </div>
    </div>
  `;
  
  detalle.innerHTML = detalleHTML;
  modal.style.display = "flex";
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
}

// ----------------------
// 4. BORRAR PEDIDO
// ----------------------
function borrarPedido(id) {
  orderToDelete = id;
  deleteOrderId.textContent = id;
  
  // Mostrar modal de confirmación
  deleteModal.style.display = "flex";
  deleteModal.style.opacity = "1";
  deleteModal.style.visibility = "visible";
}

// ----------------------
// 5. CONFIRMAR ELIMINACIÓN
// ----------------------
async function confirmDelete() {
  if (orderToDelete) {
    try {
      await fetch(`${API_URL}/${orderToDelete}`, { method: "DELETE" });
      cargarPedidos();
      closeDeleteModal();
    } catch (error) {
      console.error("Error al eliminar el pedido:", error);
      alert("Hubo un error al eliminar el pedido. Por favor, inténtalo de nuevo.");
      closeDeleteModal();
    }
  }
}

// ----------------------
// 6. CERRAR MODAL ELIMINAR
// ----------------------
function closeDeleteModal() {
  deleteModal.style.display = "none";
  deleteModal.style.opacity = "0";
  deleteModal.style.visibility = "hidden";
  orderToDelete = null;
}

// ----------------------
// 7. CERRAR MODAL DETALLES
// ----------------------
btnCerrar.addEventListener("click", () => {
  modal.style.display = "none";
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
});

// ----------------------
// 8. EVENTOS MODAL ELIMINAR
// ----------------------
btnCerrarDelete.addEventListener("click", closeDeleteModal);
btnCancelDelete.addEventListener("click", closeDeleteModal);
btnConfirmDelete.addEventListener("click", confirmDelete);

// ----------------------
// 9. INICIALIZAR
// ----------------------
cargarPedidos();