import { gestorDeDatos } from '../data-loader/productService.js';

// Cargar la vista previa del producto
async function cargarProductoDetalle() {
  // Obtener ID del producto desde la URL
  const params = new URLSearchParams(window.location.search);
  const id = params.get("pd");

  if (!id) {
    console.warn("No hay parámetro `pd` en la URL");
    return;
  }

  // Get language
  const language = localStorage.getItem('userLanguage') || 'ES';
  const idioma = language === 'EN' ? 'EN' : 'ES';

  // Textos estáticos según idioma
  const texts = idioma === 'EN' ? {
    addToCart: 'Add to Cart',
    reviews: 'Reviews',
    features: 'Features',
    origin: 'Origin',
    spain: 'Spain',
    quantity: 'Qty',
    back: 'Back to products',
    description: 'Description'
  } : {
    addToCart: 'Añadir al Carrito',
    reviews: 'Opiniones',
    features: 'Características',
    origin: 'Origen',
    spain: 'España',
    quantity: 'Cant',
    back: 'Volver a productos',
    description: 'Descripción'
  };

  // Buscar el producto
  const p = await gestorDeDatos.cargarProductoPorId(id);
  const contenedor = document.getElementById("vista-producto");

  if (!contenedor) return;

  if (p) {
    // --- MOCK DATA GENERATION ---
    // Generar rating aleatorio entre 4.0 y 5.0
    const rating = (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1);
    const reviewCount = Math.floor(Math.random() * (120 - 10) + 10);

    // Características mock (diferentes según categoría si quisiéramos ser más específicos)
    const mockFeatures = [
      { icon: 'fa-leaf', text: idioma === 'EN' ? '100% Natural' : '100% Natural' },
      { icon: 'fa-check-circle', text: idioma === 'EN' ? 'Premium Quality' : 'Calidad Premium' },
      { icon: 'fa-shipping-fast', text: idioma === 'EN' ? 'Fast Shipping' : 'Envío Rápido' }
    ];

    // Reviews mock
    const mockReviews = [
      { user: 'Maria G.', date: '2 days ago', text: 'Excelente calidad, muy recomendado!', rating: 5 },
      { user: 'John D.', date: '1 week ago', text: 'Good product, fast delivery.', rating: 4 },
      { user: 'Carlos R.', date: '2 weeks ago', text: 'Me encantó el sabor.', rating: 5 }
    ];

    // Generar estrellas HTML
    const starsHtml = Array(5).fill(0).map((_, i) => {
      if (i < Math.floor(rating)) return '<i class="fa fa-star"></i>';
      if (i === Math.floor(rating) && rating % 1 !== 0) return '<i class="fa fa-star-half-o"></i>';
      return '<i class="fa fa-star-o"></i>';
    }).join('');

    // --- RENDERIZADO HTML ---
    const imagePath = `../${p.img_url || 'assets/img/product-images/img-test.jpg'}`;

    // Compatibilidad con cartStore (classes: preview-image, preview-main, precio)
    // Agregamos data-product-id al contenedor principal para que cartStore(null, id) lo encuentre.
    contenedor.innerHTML = `
      <div class="product-grid" data-product-id="${p.id_producto}">
        
        <!-- COLUMNA IZQUIERDA: IMAGEN -->
        <div class="product-gallery">
          <div class="product-breadcrumb">
             <a href="#" onclick="history.back()">${texts.back}</a> / ${p.nombre[idioma]}
          </div>
          <div class="main-image-container preview-image">
            <img src="${imagePath}" alt="${p.nombre[idioma]}">
          </div>
        </div>

        <!-- COLUMNA DERECHA: INFO -->
        <div class="product-info preview-main">
          
          <h1 class="product-title">${p.nombre[idioma]}</h1>
          
          <div class="product-rating">
            <div class="stars">${starsHtml}</div>
            <span class="review-count" ><a href="#reviews-users">${reviewCount} ${texts.reviews}</a></span>
            <span class="origin-tag feature-tag">🇪🇸 ${texts.origin}: ${texts.spain}</span>
          </div>

          <p class="product-price precio">
            ${p.precio.toFixed(2)}€
            <span class="product-unit">/ ${p.unidad_medida[idioma]}</span>
          </p>

          <div class="product-description">
            <h3 style="font-size: 1.1rem; margin-bottom:0.5rem">${texts.description}</h3>
            <p>${p.descripcion[idioma]}</p>
          </div>

          <div class="features-list">
            ${mockFeatures.map(f => `
              <div class="feature-tag">
                <i class="fa ${f.icon}"></i> ${f.text}
              </div>
            `).join('')}
          </div>

          <!-- ACTIONS -->
          <div class="purchase-actions">
            <!-- Selector de Cantidad -->
            <div class="quantity-selector">
              <button class="qty-btn" id="qty-minus">-</button>
              <input type="number" class="qty-input" id="qty-input" value="1" min="1" max="10">
              <button class="qty-btn" id="qty-plus">+</button>
            </div>

            <button class="btn-add-cart-large" data-product-id="${p.id_producto}">
              <i class="fa fa-shopping-cart"></i>
              ${texts.addToCart}
            </button>
          </div>

        </div>

        <!-- FEATURES / REVIEWS EXTRA SECTION -->
        <div style="grid-column: 1 / -1;" class="reviews-section" id="reviews-users">
          <h2 class="section-title">${texts.reviews} (${reviewCount})</h2>
          <div class="reviews-grid">
            ${mockReviews.map(r => `
              <div class="review-card">
                <div class="review-header">
                  <span class="reviewer-name">${r.user}</span>
                  <span class="review-date">${r.date}</span>
                </div>
                <div class="stars" style="font-size: 0.9rem; margin-bottom: 0.5rem">
                  ${Array(r.rating).fill('<i class="fa fa-star"></i>').join('')}
                </div>
                <p style="font-size: 0.95rem; color: #555;">${r.text}</p>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // --- EVENT LISTENERS ---

    // 1. Add to Cart
    const addToCartBtn = contenedor.querySelector('.btn-add-cart-large');
    const qtyInput = document.getElementById('qty-input');
    let slideCart = 0;
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const quantity = parseInt(qtyInput.value) || 1;

        try {
          // Import dinámico para asegurar carga
          const { cartStore } = await import('../cart/cartStore.js');

          // Usamos la variante 'addToCart(null, id)' que scrapea el DOM buscando [data-product-id].
          // Hemos añadido las clases necesarias en el HTML de arriba.
          let cart;
          for (let i = 0; i < quantity; i++) {
            cartStore.addToCart(null, p.id_producto);
            cart = cartStore.cartLoadFromStorage();
          }
          // Re-render cart items
          const cartDrawerContainer = document.querySelector('.cart-drawer__products');
          uploadItems(cart, cartDrawerContainer);
          // Visual Feedback
          const originalContent = addToCartBtn.innerHTML;
          addToCartBtn.innerHTML = `<i class="fa fa-check"></i> ${idioma === 'EN' ? 'Added' : 'Añadido'}`;
          addToCartBtn.style.background = '#22c55e';

          setTimeout(() => {
            addToCartBtn.innerHTML = originalContent;
            addToCartBtn.style.background = '';
          }, 1500);

          // console.log(product);
          if (slideCart <= 0) {
            abrirModalCarrito();
            slideCart++;
          }

        } catch (error) {
          console.error('Error adding to cart:', error);
        }
      });
    }

    // 2. Quantity Selectors
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');

    btnMinus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val > 1) qtyInput.value = val - 1;
    });

    btnPlus.addEventListener('click', () => {
      let val = parseInt(qtyInput.value) || 1;
      if (val < 10) qtyInput.value = val + 1;
    });

  } else {
    // Producto no encontrado
    contenedor.innerHTML = `
      <div style="text-align: center; padding: 4rem;">
        <h2>${idioma === 'EN' ? 'Product not found' : 'Producto no encontrado'}</h2>
        <a href="../index.html" style="color: var(--text-main); text-decoration: underline; margin-top: 1rem; display: block;">
          ${idioma === 'EN' ? 'Return to Home' : 'Volver al Inicio'}
        </a>
      </div>
    `;
  }
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  cargarProductoDetalle();

});

const amountCart = document.querySelector('.cart-drawer__total strong');

async function uploadItems(products, cartDrawerContainer) {

  const { cartStore } = await import('../cart/cartStore.js');
  //Tendrá el contenedor de items.
  cartDrawerContainer.innerHTML = '';
  const hasProducts = products && products.length > 0;
  const texts = getCartTexts();

  products.forEach(product => {
    // console.log(product);
    const cardItem = `
        <div class="cart-item__image">
            <img src="${product.image}" alt="Producto">
        </div>
            
        <div class="cart-item__content">
            <h3 class="cart-item__name">${product.name}</h3>
            <span class="cart-item__price">${product.price}</span>
                
                <div class="cart-item__controls">
                    <button class="btn-quantity" data-action="decrease" data-id="${product.id}"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" class="quantity-input" value="${product.quantity}" min="1">
                    <button class="btn-quantity" data-action="increase" data-id="${product.id}"><i class="fa-solid fa-plus"></i></button>
                    <button class="btn-remove" data-action="remove" data-id="${product.id}"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `;
    const card = document.createElement('div');
    card.classList.add('cart-item');
    card.setAttribute('data-product-id', product.id);
    card.innerHTML = cardItem;
    cartDrawerContainer.appendChild(card);

  })

  // Update cart count and total
  let totalItems = cartStore.countCart();
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = totalItems;
  }

  if (amountCart) {
    amountCart.textContent = cartStore.totalCart() + '€';
  }

  // Show/hide checkout button based on whether there are products
  const checkoutButton = document.querySelector('.cart-drawer__checkout');
  const cartFooter = document.querySelector('.cart-drawer__footer');

  if (hasProducts) {
    // Show checkout button if it doesn't exist
    if (!checkoutButton && cartFooter) {
      const button = document.createElement('button');
      button.className = 'cart-drawer__checkout';
      button.textContent = texts.checkout;
      cartFooter.appendChild(button);

      // Re-attach event listener
      setupCheckoutButton(button);
    } else if (checkoutButton) {
      // Button exists, just make sure it's visible
      checkoutButton.style.display = 'block';
    }
  } else {
    // Hide checkout button if cart is empty
    if (checkoutButton) {
      checkoutButton.style.display = 'none';
    }
  }
}

// Function to setup checkout button event listener
function setupCheckoutButton(button) {
  if (!button) {
    button = document.querySelector('.cart-drawer__checkout');
  }

  if (!button) return;

  // Remove existing listeners by cloning and replacing
  const newButton = button.cloneNode(true);
  button.parentNode.replaceChild(newButton, button);

  newButton.addEventListener('click', () => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    const url = window.location.href;
    const urlCategoria = url.split('/');
    let basePath = '';

    if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
      basePath = '../../../';
    } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN' || urlCategoria[3] == 'FR' || urlCategoria[3] == 'EU') {
      basePath = '../';
    } else {
      basePath = './';
    }

    const userLanguage = localStorage.getItem('userLanguage') || 'ES';

    if (!currentUser) {
      // Redirect to login page
      const loginPages = {
        ES: 'sesion.html',
        EN: 'session.html',
        FR: 'connexion.html',
        EU: 'saioa.html'
      };
      const redirectPages = {
        ES: 'finalizar-compra',
        EN: 'checkout',
        FR: 'commande',
        EU: 'erosketa-bukatu'
      };
      const loginPage = loginPages[userLanguage] || 'sesion.html';
      const redirectPage = redirectPages[userLanguage] || 'finalizar-compra';
      window.location.href = `${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}`;
    } else {
      // Redirect to checkout page
      const checkoutPages = {
        ES: 'finalizar-compra.html',
        EN: 'checkout.html',
        FR: 'commande.html',
        EU: 'erosketa-bukatu.html'
      };
      const checkoutPage = checkoutPages[userLanguage] || 'finalizar-compra.html';
      window.location.href = `${basePath}${userLanguage}/${checkoutPage}`;
    }
  });
}

// Function to get current language
function getCurrentLanguage() {
  return localStorage.getItem('userLanguage') || 'ES';
}

// Textos según idioma
const cartTexts = {
  ES: {
    cart: 'Carrito',
    empty: 'Tu carrito está vacío.',
    total: 'Total',
    checkout: 'Finalizar compra',
    close: 'Cerrar carrito',
    added: '✓ Añadido'
  },
  EN: {
    cart: 'Cart',
    empty: 'Your cart is empty.',
    total: 'Total',
    checkout: 'Checkout',
    close: 'Close cart',
    added: '✓ Added'
  },
  FR: {
    cart: 'Panier',
    empty: 'Votre panier est vide.',
    total: 'Total',
    checkout: 'Commander',
    close: 'Fermer le panier',
    added: '✓ Ajouté'
  },
  EU: {
    cart: 'Saskia',
    empty: 'Zure saskia hutsik dago.',
    total: 'Guztira',
    checkout: 'Erosketa bukatu',
    close: 'Saskia itxi',
    added: '✓ Gehituta'
  }
};

// Function to get texts for current language
function getCartTexts() {
  const language = getCurrentLanguage();
  return cartTexts[language] || cartTexts.ES;
}

function abrirModalCarrito() {
  const cartDrawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.cart-drawer-overlay');

  if (cartDrawer) cartDrawer.classList.add('is-open');
  if (overlay) overlay.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

// Hacerla global
window.abrirModalCarrito = abrirModalCarrito;

