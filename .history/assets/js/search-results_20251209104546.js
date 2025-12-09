import { gestorDeDatos } from "./data-loader/productService.js";

const urlParams = new URLSearchParams(window.location.search);
const busqueda = urlParams.get('q') || '';
const idioma = localStorage.getItem('userLanguage') || 'ES';

const contenedorResultados = document.getElementById('search-results-container');
const mensajeCarga = document.getElementById('loading-message');
const tituloBusqueda = document.getElementById('search-title');
const infoBusqueda = document.getElementById('search-query-info');

async function cargarResultados() {
    if (!busqueda || busqueda.trim().length < 1) {
        mostrarSinResultados('Por favor, ingresa un término de búsqueda.');
        return;
    }

    try {
        mensajeCarga.style.display = 'block';
        const productos = await gestorDeDatos.cargarProductosPorNombre(busqueda);
        mensajeCarga.style.display = 'none';

        infoBusqueda.textContent = `Buscando: "${busqueda}" - ${productos.length} resultado${productos.length !== 1 ? 's' : ''} encontrado${productos.length !== 1 ? 's' : ''}`;

        if (productos.length === 0) {
            mostrarSinResultados(`No se encontraron productos para "${busqueda}"`);
        } else {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error('Error al cargar resultados de búsqueda:', error);
        mensajeCarga.style.display = 'none';
        mostrarSinResultados('Ocurrió un error al buscar productos. Por favor, intenta nuevamente.');
    }
}

function mostrarProductos(productos) {
    const rutaBase = '../';
    
    contenedorResultados.innerHTML = `
        <div class="products-grid container-products">
            ${productos.map(producto => `
                <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id_producto}">
                    <div class="product-image-wrapper">
                        <img src="${rutaBase}assets/img/product-images/img-test.jpg" alt="${producto.nombre[idioma]}">
                        ${producto.featured ? '<span class="featured-badge"><i class="fa-solid fa-star"></i> Destacado</span>' : ''}
                    </div>
                    <div class="product-info">
                        <div class="product-header">
                            <h3 class="item_title">${producto.nombre[idioma]}</h3>
                            <span class="product-id">ID: ${producto.id_producto}</span>
                        </div>
                        <p class="item_description">${producto.descripcion[idioma]}</p>
                        <div class="product-details">
                            <div class="product-category">
                                <i class="fa-solid fa-tag"></i>
                                <span>Categoría: ${obtenerNombreCategoria(producto.id_categoria)}</span>
                            </div>
                            <div class="product-unit">
                                <i class="fa-solid fa-weight"></i>
                                <span>${producto.unidad_medida[idioma]}</span>
                            </div>
                        </div>
                        <div class="product-footer">
                            <p class="item_price">${producto.precio}€</p>
                            <div class="item_actions">
                                <button class="btn-add-to-cart" data-product-id="${producto.id_producto}">Añadir</button>
                                <button class="btn-favorite"><i class="fa-solid fa-heart"></i></button>
                            </div>
                        </div>
                    </div>
                </article>
            `).join('')}
        </div>
    `;
    
    // Inicializar event listeners para los botones después de renderizar
    inicializarBotonesCarrito();
}

function inicializarBotonesCarrito() {
    const botonesAñadir = document.querySelectorAll('.btn-add-to-cart');
    
    botonesAñadir.forEach(boton => {
        boton.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            try {
                const { cartStore } = await import('./cart/cartStore.js');
                const productoAgregado = cartStore.addToCart(event);
                
                if (productoAgregado) {
                    // Actualizar el contador del carrito
                    const cartCount = document.getElementById('cart-count');
                    if (cartCount) {
                        cartCount.textContent = cartStore.countCart();
                    }
                    
                    // Mostrar feedback visual
                    const boton = event.target;
                    const textoOriginal = boton.textContent;
                    boton.textContent = '✓ Añadido';
                    boton.style.background = '#22c55e';
                    
                    setTimeout(() => {
                        boton.textContent = textoOriginal;
                        boton.style.background = '';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error al añadir al carrito:', error);
            }
        });
    });
}

function obtenerNombreCategoria(idCategoria) {
    const categorias = {
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

cargarResultados();
