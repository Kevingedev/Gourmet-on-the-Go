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
                        <img src="${rutaBase}${producto.img_url}" alt="${producto.nombre[idioma]}">
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
    
    // No need to initialize buttons here - cartView.js already handles it
    // The container-products class will be picked up by cartView.js automatically
}

// Removed duplicate event listener - cartView.js already handles add to cart functionality

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
