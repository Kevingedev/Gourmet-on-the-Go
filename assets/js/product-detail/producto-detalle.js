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

  // Get language
  const language = localStorage.getItem('userLanguage') || 'ES';
  const idioma = language === 'EN' ? 'EN' : 'ES';

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
    // Texts based on language
    const texts = idioma === 'EN' ? {
      addToCart: 'Add to Cart',
      generalInfo: 'General Information:'
    } : {
      addToCart: 'Añadir al carrito',
      generalInfo: 'Información general:'
    };

    // Determine image path
    const rutaBase = '../';
    const imagePath = `${rutaBase}assets/img/product-images/img-test.jpg`;

    contenedor.innerHTML = `
      <section class="preview-card">

        <!-- FOTO GRANDE -->
        <div class="preview-image">
          <img src="${imagePath}" alt="${p.nombre[idioma]}">
        </div>

        <!-- INFORMACIÓN PRINCIPAL -->
        <div class="preview-main">
          <h1>${p.nombre[idioma]}</h1>
          <p>${p.unidad_medida[idioma]}</p>
          <p class="precio">${p.precio.toFixed(2)}€</p>
          <button class="btn-carrito btn-add-to-cart" data-product-id="${p.id_producto}">${texts.addToCart}</button>
        </div>

        <!-- DESCRIPCIÓN -->
        <div class="info-general">
          <h2>${texts.generalInfo}</h2>
          <p>${p.descripcion[idioma]}</p>
        </div>

      </section>
    `;

    // Add event listener for add to cart button
    const addToCartBtn = contenedor.querySelector('.btn-add-to-cart');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
          const { cartStore } = await import('../cart/cartStore.js');
          const event = {
            target: {
              closest: () => addToCartBtn.closest('.preview-card'),
              getAttribute: (attr) => {
                if (attr === 'data-product-id') return p.id_producto;
                return null;
              }
            }
          };
          
          cartStore.addToCart(event);
          
          // Visual feedback
          const originalText = addToCartBtn.textContent;
          const addedText = idioma === 'EN' ? '✓ Added' : '✓ Añadido';
          addToCartBtn.textContent = addedText;
          addToCartBtn.style.background = '#22c55e';
          addToCartBtn.style.color = 'white';
          
          setTimeout(() => {
            addToCartBtn.textContent = originalText;
            addToCartBtn.style.background = '';
            addToCartBtn.style.color = '';
          }, 1500);
        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      });
    }

  } else {
    const notFoundText = idioma === 'EN' ? 'Product not found' : 'Producto no encontrado';
    contenedor.innerHTML = `<h2>${notFoundText}</h2>`;
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProductoDetalle();
});
