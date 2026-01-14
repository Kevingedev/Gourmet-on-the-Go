
import { config } from "../lib/config/config.js";
import { productsService } from "../lib/actions/productsServices.js";
const API_URL = config.API_URL;

export const updateProductModal = {

    async renderUpdateProductModal(id_producto) {

        // console.log("id_producto: " + id_producto);
        
        const modal = document.getElementById("productModal");
        
        if (!modal) {
            console.error("No se encontró el elemento #productModal");
            return;
        }
        // Producto
        const productData = await productsService.getProductById(id_producto).then(product => product);

        // console.log(product);

        let categoryOptions = "";
        try {
            const response = await fetch(`${API_URL}/categories`);
            const categories = await response.json();

            categories.forEach(category => {
                categoryOptions += `<option value="${category.id_categoria}" ${productData.id_categoria === category.id_categoria ? 'selected' : ''}>
                ${category.nombre.ES}</option>`;
            });
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            categoryOptions = '<option value="">Error al cargar categorías</option>';
        }

        modal.innerHTML = 
        `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Registro de Producto</h2>
                <span class="close-btn" id="btnClose">&times;</span>
            </div>

            <form id="productForm">
                <div class="form-group">
                    <label for="productName">Nombre:</label>
                    <input type="text" id="productName" name="name" value="${productData.nombre.ES}" placeholder="Ej. Lomo de Salmón" required>
                </div>
                <div class="form-group">
                    <label for="productDesc">Descripción:</label>
                    <input type="text" id="productDesc" name="description" value="${productData.descripcion.ES}" placeholder="Breve detalle del producto" required>
                </div>
                <div class="form-group">
                    <label for="productUnit">Unidad de medida:</label>
                    <input type="text" id="productUnit" name="unit" value="${productData.unidad_medida.ES}" placeholder="Ej. 250g, Unidad, Kg" required>
                </div>
                <div class="form-group">
                    <label for="price">Precio (€):</label>
                    <input type="number" id="price" name="price" step="0.01" value="${productData.precio}" placeholder="0.00" required>
                </div>
                <div class="form-group">
                    <label for="featured">Características:</label>
                    <select name="featured" id="featured" value="${productData.featured}">
                        <option value="true" ${productData.featured === true ? 'selected' : ''}>Destacado</option>
                        <option value="false" ${productData.featured === false ? 'selected' : ''}>No destacado</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="category">Categoría:</label>
                    <select name="id_categoria" id="category" value="${productData.id_categoria}">
                        ${categoryOptions}
                    </select>
                </div>

                <button type="submit" class="btn-save">Guardar Producto</button>
            </form>
        </div>
        `;
        // IMPORTANTE: Obtenemos las referencias DESPUÉS de hacer el innerHTML
        const productForm = document.getElementById("productForm");
        const btnClose = document.getElementById("btnClose");

        modal.style.display = "block"; // El CSS lo convertirá a flex !important y activará la animación

        const closeModal = () => {
            modal.style.display = "none";
            const currentForm = document.getElementById("productForm");
            if (currentForm) currentForm.reset();
        };

        if (btnClose) {
            btnClose.onclick = closeModal;
        }

        // Cerrar al hacer clic fuera
        window.onclick = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        // El preventDefault ahora funcionará porque productForm ya no es null
        if (productForm) {
            productForm.onsubmit = async (e) => {
                e.preventDefault();

                const formData = new FormData(productForm);
                const product = Object.fromEntries(formData.entries());

                // Generación de ID dinámico (Prefijo de categoría + número con ceros)
                // console.log(productData.id);
                const totalProducts = productData.id;
                const categoryParts = product.id_categoria.split("_");
                const prefix = categoryParts.length > 1
                    ? (categoryParts[0][0] + categoryParts[1][0]).toUpperCase()
                    : (categoryParts[0].slice(0, 2)).toUpperCase();

                const id_producto_string = prefix + String(totalProducts + 1).padStart(3, '0');
                const id_producto = totalProducts;

                // Formatear nombre para la URL de la imagen (minúsculas, guiones, sin acentos básicos)
                const cleanName = product.name
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, '-');

                const img_url = `assets/img/product-images/${cleanName}.jpg`;

                const newProduct = {
                    id: id_producto,
                    id_producto: id_producto_string,
                    id_categoria: product.id_categoria,
                    nombre: {
                        ES: product.name,
                        EN: product.name, // Idealmente se traduciría
                        FR: product.name,
                        EU: product.name
                    },
                    descripcion: {
                        ES: product.description,
                        EN: product.description,
                        FR: product.description,
                        EU: product.description
                    },
                    unidad_medida: {
                        ES: product.unit,
                        EN: product.unit,
                        FR: product.unit,
                        EU: product.unit
                    },
                    featured: product.featured === "true",
                    precio: parseFloat(product.price),
                    img_url: img_url
                };

                try {
                    // console.log(newProduct);
                    await productsService.updateProduct(id_producto, newProduct);
                    // alert(`Producto "${product.name}" guardado con éxito.`);
                    closeModal();

                    window.dispatchEvent(new CustomEvent('productUpdated'));
                } catch (error) {
                    console.error("Error al crear el producto:", error);
                    alert("Error al guardar el producto");
                }
            };
        }
    }

}