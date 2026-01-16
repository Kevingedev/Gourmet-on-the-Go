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
      let user = { username: 'Usuario eliminado' };
      try {
        const userResponse = await fetch(`${USERS_URL}/${p.userId}`);
        if (userResponse.ok) {
          user = await userResponse.json();
        }
      } catch (error) {
        console.log(`Usuario ${p.userId} no encontrado`);
      }

      return `
        <tr>
          <td>${p.id}</td>
          <td>${user.username}</td>
          <td>${p.checkoutData?.total ? p.checkoutData?.total : '0.00 €'}</td>
          <td>${p.orderDate ? new Date(p.orderDate).toLocaleString('es-ES') : 'Sin fecha'}</td>
          <td>
            <button class="btn-detalle" data-id="${p.id}" title="Ver detalles">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-borrar" data-id="${p.id}" title="Eliminar pedido">
              <i class="fas fa-trash"></i>
            </button>
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

    // Contenedor principal del modal con scroll interno y diseño centrado, moderno y minimalista
    const detalleHTML = `
      <div class="modal-card" style="max-width:900px; width:95%; background: #ffffff; border-radius: 12px; box-shadow: 0 12px 40px rgba(12,128,56,0.12); padding: 18px; max-height: 60vh; overflow:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem; margin-bottom: 0.5rem;">
          <h3 style="margin:0; font-size:1.05rem; color:#0c8038;">Detalle del Pedido</h3>
          <small style="color:#6b7280;">ID: ${pedido.id}</small>
        </div>

        <div class="detalle-grupo" style="display:grid; grid-template-columns: 1fr; gap:0.5rem;">
          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Usuario:</label>
            <span style="color:#374151;">${pedido.userId}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Cliente:</label>
            <span style="color:#374151;">${pedido.checkoutData?.shipping?.fullName || 'No disponible'}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Email:</label>
            <span style="color:#6b7280;">${pedido.checkoutData?.shipping?.email || 'No disponible'}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Teléfono:</label>
            <span style="color:#6b7280;">${pedido.checkoutData?.shipping?.phone || 'No disponible'}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Dirección:</label>
            <span style="color:#6b7280;">${pedido.checkoutData?.shipping?.address || 'No disponible'}${pedido.checkoutData?.shipping?.city ? ', ' + pedido.checkoutData.shipping.city : ''}${pedido.checkoutData?.shipping?.country ? ', ' + pedido.checkoutData.shipping.country : ''}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Pago:</label>
            <span style="color:#6b7280;">${pedido.checkoutData?.payment?.method || 'No disponible'}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Total:</label>
            <span style="color:#d97706; font-weight:700;">${pedido.checkoutData?.total || '0.00€'}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Estado:</label>
            <span class="estado-badge ${pedido.status}" style="padding:4px 8px; border-radius:999px; background:rgba(12,128,56,0.08); color:#0c8038; font-weight:600;">${pedido.status}</span>
          </div>

          <div class="detalle-item" style="display:flex; justify-content:space-between; gap:1rem;">
            <label style="color:#374151; font-weight:600;">Fecha:</label>
            <span style="color:#6b7280;">${pedido.orderDate ? new Date(pedido.orderDate).toLocaleString('es-ES') : 'Sin fecha'}</span>
          </div>

          <div style="margin-top:6px;">
            <label style="display:block; color:#374151; font-weight:700; margin-bottom:6px;">Productos:</label>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-wrap:wrap; gap:10px;">
              ${pedido.checkoutData?.cart?.map(item => `
                <li style="display:flex; align-items:center; gap:10px; background:#f9fafb; border:1px solid #eef2f6; padding:8px 10px; border-radius:8px; min-width:220px;">
                  <img src="${item.image}" alt="${item.name}" style="width:56px; height:56px; object-fit:cover; border-radius:6px;">
                  <div style="display:flex; flex-direction:column; gap:4px;">
                    <span style="font-weight:600; color:#111827;">${item.name}</span>
                    <span style="color:#6b7280; font-size:0.9rem;">${item.quantity} × <strong style="color:#d97706;">${item.price}</strong></span>
                  </div>
                </li>
              `).join('') || '<li style="color:#6b7280;">No hay productos</li>'}
            </ul>
          </div>
        </div>
      </div>
    `;

    detalle.innerHTML = detalleHTML;

    // Asegurarse de que el overlay modal esté centrado y permita scroll interno
    modal.style.display = "flex";
    modal.style.alignItems = "center"; // centra verticalmente
    modal.style.justifyContent = "center"; // centra horizontalmente
    modal.style.padding = "1.25rem"; // espacio alrededor en pantallas pequeñas
    modal.style.overflow = "auto"; // permite scroll si el contenido es mayor que viewport
    modal.style.opacity = "1";
    modal.style.visibility = "visible";

    // Evitar scroll del body mientras el modal está abierto
    document.body.style.overflow = 'hidden';
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
      await fetch(`${ API_URL }/${orderToDelete}`, { method: "DELETE" });
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
  // Restaurar scroll del body al cerrar modal
  document.body.style.overflow = '';
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