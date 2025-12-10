import { gestorDeDatos } from "./data-loader/productService.js";

const featuredProductsLoader = document.getElementById('featured-products-loader');
const categoriesLoader = document.getElementById('categorias-loader');
const LANGUAGE = gestorDeDatos.language;

// Textos según idioma
const texts = {
    ES: {
        addToCart: 'Añadir',
        added: '✓ Añadido'
    },
    EN: {
        addToCart: 'Add to Cart',
        added: '✓ Added'
    }
};

// Only load featured products if container exists
if (featuredProductsLoader) {
    gestorDeDatos.cargarProductosDestacados().then(productos => {

        productos.forEach(producto => {
            featuredProductsLoader.innerHTML += `
            <article class="section-productos-destacados__item cart-item" data-product-id="${producto.id_producto}">
            <a href="producto-detalle.html?pd=${producto.id_producto}">
                <img src="../assets/img/product-images/img-test.jpg" alt="${producto.nombre[LANGUAGE]}">
            </a>
                <h3 class="item_title">${producto.nombre[LANGUAGE]}</h3>
                <p class="item_description">${producto.descripcion[LANGUAGE]}</p>
                <p class="item_price">${producto.precio}€</p>
                <div class="item_actions">
                    <button class="btn-add-to-cart">${texts[LANGUAGE]?.addToCart || texts.ES.addToCart}</button>
                    <button class="btn-favorite"><i class="fa-solid fa-heart"></i></button>
                </div>
            </article>
            `;
        });

    });
}

// Only load categories if container exists
if (categoriesLoader) {
    gestorDeDatos.cargarCategorias().then(categorias => {

        categorias.forEach(categoria => {

            categoriesLoader.innerHTML += `
                <a href="../${LANGUAGE}${categoria.url_slug[LANGUAGE]}" class="category-card">
                    <img src="${categoria.img}" alt="${categoria.nombre[LANGUAGE]}">
                    <div class="category-overlay">
                        <h3>${categoria.nombre[LANGUAGE]}</h3>
                    </div>
                </a>
            `;
        });

    });
}         <button class="btn-carrito btn-add-to-cart" data-product-id="${p.id_producto}">${texts.addToCart}</button>
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
