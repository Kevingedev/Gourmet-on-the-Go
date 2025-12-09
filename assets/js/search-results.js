import { gestorDeDatos } from "./data-loader/productService.js";

const urlParams = new URLSearchParams(window.location.search);
const busqueda = urlParams.get('q') || '';
const idioma = localStorage.getItem('userLanguage') || 'ES';

const contenedorResultados = document.getElementById('search-results-container');
const mensajeCarga = document.getElementById('loading-message');
const tituloBusqueda = document.getElementById('search-title');
const infoBusqueda = document.getElementById('search-query-info');

// Actualizar título de búsqueda según idioma
if (tituloBusqueda) {
    tituloBusqueda.textContent = idioma === 'EN' ? 'Search Results' : 'Resultados de búsqueda';
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarResultados();
});

async function cargarResultados() {
    const textos = idioma === 'EN' ? {
        noQuery: 'Please enter a search term.',
        searching: 'Searching',
        results: 'result found',
        noResults: 'No products found for',
        loading: 'Searching products...',
        category: 'Category',
        addToCart: 'Add'
    } : {
        noQuery: 'Por favor, ingresa un término de búsqueda.',
        searching: 'Buscando',
        results: 'resultado encontrado',
        noResults: 'No se encontraron productos para',
        loading: 'Buscando productos...',
        category: 'Categoría',
        addToCart: 'Añadir'
    };

    if (!busqueda || busqueda.trim().length < 1) {
        mostrarSinResultados(textos.noQuery);
        return;
    }

    try {
        mensajeCarga.style.display = 'block';
        mensajeCarga.textContent = textos.loading;
        const productos = await gestorDeDatos.cargarProductosPorNombre(busqueda);
        mensajeCarga.style.display = 'none';

        const resultadoTexto = productos.length === 1 
            ? textos.results 
            : (idioma === 'EN' ? 'results found' : 'resultados encontrados');
        infoBusqueda.textContent = `${textos.searching}: "${busqueda}" - ${productos.length} ${resultadoTexto}`;

        if (productos.length === 0) {
            mostrarSinResultados(`${textos.noResults} "${busqueda}"`);
        } else {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error('Error al cargar resultados de búsqueda:', error);
        mensajeCarga.style.display = 'none';
        const errorText = idioma === 'EN' 
            ? 'An error occurred while searching for products. Please try again.' 
            : 'Ocurrió un error al buscar productos. Por favor, intenta nuevamente.';
        mostrarSinResultados(errorText);
    }
}

function mostrarProductos(productos) {
    const rutaBase = '../';
    const textos = idioma === 'EN' ? {
        featured: 'Featured',
        category: 'Category',
        addToCart: 'Add',
        added: '✓ Added'
    } : {
        featured: 'Destacado',
        category: 'Categoría',
        addToCart: 'Añadir',
        added: '✓ Añadido'
    };
    
    contenedorResultados.innerHTML = `
        <div class="products-grid container-products">
            ${productos.map(producto => `
                <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id_producto}">
                    <div class="product-image-wrapper">
                        <img src="${rutaBase}assets/img/product-images/img-test.jpg" alt="${producto.nombre[idioma]}">
                        ${producto.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${textos.featured}</span>` : ''}
                    </div>
                    <h3 class="item_title">${producto.nombre[idioma]}</h3>
                    <p class="item_description">${producto.descripcion[idioma]}</p>
                    <div class="product-info">
                        <div class="product-header">
                            <span class="product-id">ID: ${producto.id_producto}</span>
                        </div>
                        <div class="product-details">
                            <div class="product-category">
                                <i class="fa-solid fa-tag"></i>
                                <span>${textos.category}: ${obtenerNombreCategoria(producto.id_categoria)}</span>
                            </div>
                            <div class="product-unit">
                                <i class="fa-solid fa-weight"></i>
                                <span>${producto.unidad_medida[idioma]}</span>
                            </div>
                        </div>
                        <p class="item_price">${producto.precio}€</p>
                    </div>
                    <div class="item_actions">
                        <button class="btn-add-to-cart">${textos.addToCart}</button>
                        <button class="btn-favorite"><i class="fa-solid fa-heart"></i></button>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
    
    // Inicializar event listeners para los botones después de renderizar
    inicializarBotonesCarrito();
}

function inicializarBotonesCarrito() {
    // Esperar a que cartView.js esté completamente cargado
    setTimeout(() => {
        const containerProducts = document.querySelector('.container-products');
        if (!containerProducts) return;
        
        // Agregar event listener usando event delegation
        containerProducts.addEventListener('click', async (event) => {
            if (event.target.classList.contains('btn-add-to-cart')) {
                event.preventDefault();
                event.stopPropagation();
                
                try {
                    const { cartStore } = await import('./cart/cartStore.js');
                    const products = cartStore.addToCart(event);
                    
                    if (products && Array.isArray(products)) {
                        // Actualizar el drawer del carrito
                        const cartDrawerContainer = document.querySelector('.cart-drawer__products');
                        const drawerEmpty = document.querySelector('.cart-drawer__empty');
                        
                        if (cartDrawerContainer) {
                            if (drawerEmpty) drawerEmpty.style.display = 'none';
                            await actualizarCarrito(products, cartDrawerContainer);
                            
                            // Abrir el carrito automáticamente
                            const cartDrawer = document.querySelector('[data-cart-drawer]');
                            const cartOverlay = document.querySelector('[data-cart-overlay]');
                            if (cartDrawer && cartOverlay) {
                                cartDrawer.classList.add('is-open');
                                cartOverlay.classList.add('is-open');
                                document.body.style.overflow = 'hidden';
                            }
                        }
                        
                        // Actualizar contador del carrito
                        const cartCount = document.getElementById('cart-count');
                        if (cartCount) {
                            cartCount.textContent = cartStore.countCart();
                        }
                        
                        // Feedback visual
                        const boton = event.target;
                        const textoOriginal = boton.textContent;
                        const textos = idioma === 'EN' ? '✓ Added' : '✓ Añadido';
                        boton.textContent = textos;
                        boton.style.background = '#22c55e';
                        boton.style.color = 'white';
                        
                        setTimeout(() => {
                            boton.textContent = textoOriginal;
                            boton.style.background = '';
                            boton.style.color = '';
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Error al añadir al carrito:', error);
                }
            }
        });
    }, 1000);
}

async function actualizarCarrito(products, container) {
    container.innerHTML = '';
    products.forEach(product => {
        const cardItem = `
            <div class="cart-item__image">
                <img src="${product.image}" alt="Producto">
            </div>
            <div class="cart-item__content">
                <h3 class="cart-item__name">${product.name}</h3>
                <span class="cart-item__price">${product.price}</span>
                <div class="cart-item__controls">
                    <button class="btn-quantity" data-action="decrease"><i class="fa-solid fa-minus"></i></button>
                    <input type="number" class="quantity-input" value="${product.quantity}" min="1">
                    <button class="btn-quantity" data-action="increase"><i class="fa-solid fa-plus"></i></button>
                    <button class="btn-remove" data-action="remove"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `;
        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.setAttribute('data-product-id', product.id);
        card.innerHTML = cardItem;
        container.appendChild(card);
    });
    
    // Actualizar total
    try {
        const { cartStore } = await import('./cart/cartStore.js');
        const totalElement = document.querySelector('.cart-drawer__total strong');
        if (totalElement) {
            totalElement.textContent = `${cartStore.amountCart()}€`;
        }
    } catch (error) {
        console.error('Error al actualizar total:', error);
    }
}

function obtenerNombreCategoria(idCategoria) {
    const categorias = idioma === 'EN' ? {
        'protein_meat': 'Meat and Poultry',
        'fish_seafood': 'Fish and Seafood',
        'sides_comp': 'Sides',
        'breakfast_brunch': 'Breakfast'
    } : {
        'protein_meat': 'Carnes y Aves',
        'fish_seafood': 'Pescados y Mariscos',
        'sides_comp': 'Complementos',
        'breakfast_brunch': 'Desayunos'
    };
    return categorias[idCategoria] || idCategoria;
}

function mostrarSinResultados(mensaje) {
    contenedorResultados.innerHTML = `
        <div class="no-results">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.1rem; color: #6b7280;">${mensaje}</p>
        </div>
    `;
}
