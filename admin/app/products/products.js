
import { productsService } from "../../lib/actions/productsServices.js";
import { addProductModal } from "../../components/AddProductModal.js";
import { updateProductModal } from "../../components/UpdateProductModal.js";
import { deleteProductModal } from "../../components/DeleteProductModal.js";

const body = document.getElementById("products-table-body");
const footer = document.getElementById("products-table-footer");

// Pagination state
let currentPage = 1;
const itemsPerPage = 5;

renderProducts();

function renderProducts() {
    productsService.getProductsPagination(currentPage, itemsPerPage).then(({ products, total }) => {
        const totalPages = Math.ceil(total / itemsPerPage);
        // Render rows
        body.innerHTML = "";
        products.forEach(product => {
            body.innerHTML += `
            <tr>
            <td>${product.id_producto}</td>
            <td>${product.nombre.ES}</td>
            <td>${product.descripcion.ES ? product.descripcion.ES.slice(0, 40) + '...' : ''}</td>
            <td>${product.unidad_medida.ES}</td>
            <td>${product.precio}€</td>
            <td>${product.featured ? `<span class="featured">Destacado</span>` : `<span class="not-featured">No destacado</span>`}</td>
            <td>
            <button class="action-btn edit" data-id="${product.id}"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="action-btn delete" data-id="${product.id}" data-name="${product.nombre.ES}"><i class="fa-solid fa-trash"></i></button>
            </td>
            </tr>
            `;
        });

        // Render pagination
        renderPagination(totalPages);
    });
}

function renderPagination(totalPages) {
    let paginationHTML = `<tr><td colspan="7"><div class="pagination">`;

    // Previous button
    paginationHTML += `<button class="pagination-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
        <i class="fa-solid fa-chevron-left"></i>
    </button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    // Next button
    paginationHTML += `<button class="pagination-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
        <i class="fa-solid fa-chevron-right"></i>
    </button>`;

    paginationHTML += `</div></td></tr>`;
    footer.innerHTML = paginationHTML;
}

// Global function for pagination buttons
window.goToPage = function (page) {
    currentPage = page;
    renderProducts();
};

const btnOpen = document.getElementById("openModalBtn");
btnOpen.onclick = () => {
    addProductModal.render();
};

const table = document.getElementById("products-table");
table.addEventListener("click", (e) => {
    // Edit button
    const btnEdit = e.target.closest(".edit");
    if (btnEdit) {
        const id = btnEdit.getAttribute("data-id");
        updateProductModal.renderUpdateProductModal(id);
    }

    // Delete button
    const btnDelete = e.target.closest(".delete");
    if (btnDelete) {
        const id = btnDelete.getAttribute("data-id");
        const name = btnDelete.getAttribute("data-name");
        deleteProductModal.render(id, name);
    }
});

// Eventos para refrescar tabla
window.addEventListener('productAdded', () => renderProducts());
window.addEventListener('productUpdated', () => renderProducts());
window.addEventListener('productDeleted', () => renderProducts());
