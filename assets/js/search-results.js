import { gestorDeDatos } from "./data-loader/productService.js";

const urlParams = new URLSearchParams(window.location.search);
const busqueda = urlParams.get('q') || '';
const idioma = localStorage.getItem('userLanguage') || 'ES';

const contenedorResultados = document.getElementById('search-results-container');
const mensajeCarga = document.getElementById('loading-message');
const tituloBusqueda = document.getElementById('search-title');
const infoBusqueda = document.getElementById('search-query-info');

// Actualizar título de búsqueda según idioma
const searchTitles = {
    ES: 'Resultados de búsqueda',
    EN: 'Search Results',
    FR: 'Résultats de recherche',
    EU: 'Bilaketa emaitzak'
};
if (tituloBusqueda) {
    tituloBusqueda.textContent = searchTitles[idioma] || searchTitles.ES;
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    cargarResultados();
});

async function cargarResultados() {
    const textos = {
        ES: {
            noQuery: 'Por favor, ingresa un término de búsqueda.',
            searching: 'Buscando',
            results: 'resultado encontrado',
            resultsPlural: 'resultados encontrados',
            noResults: 'No se encontraron productos para',
            loading: 'Buscando productos...',
            category: 'Categoría',
            addToCart: 'Añadir',
            featured: 'Destacado',
            error: 'Ocurrió un error al buscar productos. Por favor, intenta nuevamente.'
        },
        EN: {
            noQuery: 'Please enter a search term.',
            searching: 'Searching',
            results: 'result found',
            resultsPlural: 'results found',
            noResults: 'No products found for',
            loading: 'Searching products...',
            category: 'Category',
            addToCart: 'Add',
            featured: 'Featured',
            error: 'An error occurred while searching for products. Please try again.'
        },
        FR: {
            noQuery: 'Veuillez entrer un terme de recherche.',
            searching: 'Recherche',
            results: 'résultat trouvé',
            resultsPlural: 'résultats trouvés',
            noResults: 'Aucun produit trouvé pour',
            loading: 'Recherche de produits...',
            category: 'Catégorie',
            addToCart: 'Ajouter',
            featured: 'En vedette',
            error: 'Une erreur s\'est produite lors de la recherche de produits. Veuillez réessayer.'
        },
        EU: {
            noQuery: 'Mesedez, sartu bilaketa termino bat.',
            searching: 'Bilatzen',
            results: 'emaitza aurkitu',
            resultsPlural: 'emaitza aurkitu',
            noResults: 'Ez da produkturik aurkitu',
            loading: 'Produktuak bilatzen...',
            category: 'Kategoria',
            addToCart: 'Gehitu',
            featured: 'Nabarmendua',
            error: 'Errore bat gertatu da produktuak bilatzean. Mesedez, saiatu berriro.'
        }
    };
    const currentTexts = textos[idioma] || textos.ES;

    if (!busqueda || busqueda.trim().length < 1) {
        mostrarSinResultados(currentTexts.noQuery);
        return;
    }

    try {
        mensajeCarga.style.display = 'block';
        mensajeCarga.textContent = currentTexts.loading;
        const productos = await gestorDeDatos.cargarProductosPorNombre(busqueda);
        mensajeCarga.style.display = 'none';

        const resultadoTexto = productos.length === 1 
            ? currentTexts.results 
            : currentTexts.resultsPlural;
        infoBusqueda.textContent = `${currentTexts.searching}: "${busqueda}" - ${productos.length} ${resultadoTexto}`;

        if (productos.length === 0) {
            mostrarSinResultados(`${currentTexts.noResults} "${busqueda}"`);
        } else {
            mostrarProductos(productos);
        }
    } catch (error) {
        console.error('Error al cargar resultados de búsqueda:', error);
        mensajeCarga.style.display = 'none';
        mostrarSinResultados(currentTexts.error);
    }
}

function mostrarProductos(productos) {
    const rutaBase = '../';
    const textos = {
        ES: {
            featured: 'Destacado',
            category: 'Categoría',
            addToCart: 'Añadir',
            added: '✓ Añadido'
        },
        EN: {
            featured: 'Featured',
            category: 'Category',
            addToCart: 'Add',
            added: '✓ Added'
        },
        FR: {
            featured: 'En vedette',
            category: 'Catégorie',
            addToCart: 'Ajouter',
            added: '✓ Ajouté'
        },
        EU: {
            featured: 'Nabarmendua',
            category: 'Kategoria',
            addToCart: 'Gehitu',
            added: '✓ Gehituta'
        }
    };
    const currentTexts = textos[idioma] || textos.ES;
    
    // Determine product detail page based on language
    const detailPages = {
        ES: 'producto-detalle.html',
        EN: 'product-detail.html',
        FR: 'detail-produit.html',
        EU: 'produktu-xehetasuna.html'
    };
    const langPaths = {
        ES: 'ES',
        EN: 'EN',
        FR: 'FR',
        EU: 'EU'
    };
    const detailPage = detailPages[idioma] || 'producto-detalle.html';
    const langPath = langPaths[idioma] || 'ES';
    
    contenedorResultados.innerHTML = `
        <div class="products-grid container-products">
            ${productos.map(producto => `
                <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id_producto}">
                    <div class="product-image-wrapper">
                        <img src="${rutaBase}${producto.img_url}" alt="${producto.nombre[idioma]}">
                        ${producto.featured ? `<span class="featured-badge"><i class="fa-solid fa-star"></i> ${currentTexts.featured}</span>` : ''}
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
                                <span>${currentTexts.category}: ${obtenerNombreCategoria(producto.id_categoria)}</span>
                            </div>
                            <div class="product-unit">
                                <i class="fa-solid fa-weight"></i>
                                <span>${producto.unidad_medida[idioma]}</span>
                            </div>
                        </div>
                        <p class="item_price">${producto.precio}€</p>
                    </div>
                    <div class="item_actions">
                        <button class="btn-add-to-cart">${currentTexts.addToCart}</button>
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
    const categorias = {
        ES: {
            'protein_meat': 'Carnes y Aves',
            'fish_seafood': 'Pescados y Mariscos',
            'sides_comp': 'Complementos',
            'breakfast_brunch': 'Desayunos'
        },
        EN: {
            'protein_meat': 'Meat and Poultry',
            'fish_seafood': 'Fish and Seafood',
            'sides_comp': 'Sides',
            'breakfast_brunch': 'Breakfast'
        },
        FR: {
            'protein_meat': 'Viandes et Volaille',
            'fish_seafood': 'Poissons et Fruits de mer',
            'sides_comp': 'Accompagnements',
            'breakfast_brunch': 'Petit-déjeuner'
        },
        EU: {
            'protein_meat': 'Haragiak eta Hegaztiak',
            'fish_seafood': 'Arrainak eta Itsaskiak',
            'sides_comp': 'Osagarriak',
            'breakfast_brunch': 'Gosariak'
        }
    };
    const catMap = categorias[idioma] || categorias.ES;
    return catMap[idCategoria] || idCategoria;
}

function mostrarSinResultados(mensaje) {
    contenedorResultados.innerHTML = `
        <div class="no-results">
            <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
            <p style="font-size: 1.1rem; color: #6b7280;">${mensaje}</p>
        </div>
    `;
}
