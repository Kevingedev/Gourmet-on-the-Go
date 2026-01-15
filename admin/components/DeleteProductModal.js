/* admin/components/DeleteProductModal.js */
import { productsService } from "../lib/actions/productsServices.js";

export const deleteProductModal = {
    render: function (id_producto, productName) {
        const modal = document.getElementById("productModal");

        if (!modal) {
            console.error("No se encontró el elemento #productModal");
            return;
        }

        modal.innerHTML = `
        <div class="modal-content modal-content--small">
            <div class="modal-header modal-header--danger">
                <h2><i class="fa-solid fa-triangle-exclamation"></i> Confirmar Eliminación</h2>
                <span class="close-btn" id="btnClose">&times;</span>
            </div>

            <div class="modal-body">
                <p class="delete-message">¿Estás seguro de que deseas eliminar el producto:</p>
                <p class="delete-product-name">"${productName}"</p>
                <p class="delete-warning">Esta acción no se puede deshacer.</p>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn-cancel" id="btnCancelDelete">Cancelar</button>
                <button type="button" class="btn-delete" id="btnConfirmDelete">Eliminar</button>
            </div>
        </div>
        `;

        modal.style.display = "block";

        const btnClose = document.getElementById("btnClose");
        const btnCancel = document.getElementById("btnCancelDelete");
        const btnConfirm = document.getElementById("btnConfirmDelete");

        const closeModal = () => {
            modal.style.display = "none";
        };

        btnClose.onclick = closeModal;
        btnCancel.onclick = closeModal;

        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        btnConfirm.onclick = async () => {
            try {
                await productsService.deleteProduct(id_producto);
                closeModal();
                window.dispatchEvent(new CustomEvent('productDeleted'));
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                alert("Error al eliminar el producto");
            }
        };
    }
};
