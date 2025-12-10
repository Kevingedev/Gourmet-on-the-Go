import { gestorDeDatos } from '../data-loader/productService.js';

// Cargar la vista previa del producto
async function cargarProductoDetalle() {

  // Obtener ID del producto desde la URL (ejemplo: vista.html?pd=3)
  const params = new URLSearchParams(window.location.search);
  const id = params.get("pd");

  console.log("ID desde la URL:", id);

  if (!id) {
    console.warn("No hay parámetro `pd` en la URL");
    return;
  }

  // Buscar el producto dentro de la base de datos
  const p = await gestorDeDatos.cargarProductoPorId(id);

  console.log("Producto cargado:", p);

  const contenedor = document.getElementById("vista-producto");
  if (!contenedor) {
    console.error("No existe el div #vista-producto");
    return;
  }

  // Si encontró el producto
  if (p) {

    contenedor.innerHTML = `
      <section class="preview-card">

        <!-- FOTO GRANDE -->
        <div class="preview-image">
          <img src="../../assets/img/products/${p.id_producto}.jpg" alt="${p.nombre.ES}">
        </div>

        <!-- INFORMACIÓN PRINCIPAL -->
        <div class="preview-main">
          <h1>${p.nombre.ES}</h1>
          <p>${p.unidad_medida.ES}</p>
          <p class="precio">${p.precio.toFixed(2)}€</p>
          <button class="btn-carrito">Añadir al carrito</button>
        </div>

        <!-- DESCRIPCIÓN -->
        <div class="info-general">
          <h2>Información general:</h2>
          <p>${p.descripcion.ES}</p>
        </div>

      </section>
    `;

  } else {
    contenedor.innerHTML = "<h2>Producto no encontrado</h2>";
  }
}

// Ejecutar al cargar la página
cargarProductoDetalle();
