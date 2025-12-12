import { favoriteStore } from "./favoriteStore.js";
import { gestorDeDatos } from "../data-loader/productService.js";

const pathname = window.location.pathname;
// Verifica si la página actual es la de favoritos en varios idiomas
const isWishlistPage = pathname.includes('favoritos.html') || pathname.includes('favorites.html') || pathname.includes('favoris.html') || pathname.includes('maitaleak.html');

const LANGUAGE = gestorDeDatos.language;
// Textos según idioma
const texts = {
    ES: {
        addToCart: 'Añadir',
        added: '✓ Añadido',
        loading: 'Cargando productos...',
        noProducts: 'No hay productos disponibles en esta categoría.',
        featured: 'Destacado'
    },
    EN: {
        addToCart: 'Add to Cart',
        added: '✓ Added',
        loading: 'Loading products...',
        noProducts: 'No products available in this category.',
        featured: 'Featured'
    },
    FR: {
        addToCart: 'Ajouter',
        added: '✓ Ajouté',
        loading: 'Chargement des produits...',
        noProducts: 'Aucun produit disponible dans cette catégorie.',
        featured: 'En vedette'
    },
    EU: {
        addToCart: 'Gehitu',
        added: '✓ Gehituta',
        loading: 'Produktuak kargatzen...',
        noProducts: 'Ez dago produkturik kategoria honetan.',
        featured: 'Nabarmendua'
    }
};

document.addEventListener('DOMContentLoaded', () => {
   
    const productList = document.querySelector('.container-products'); 
    
    productList.addEventListener('click', (event) => {

        if (event.target.classList.contains('btn-add-to-wishlist')) {

            const wishlist = favoriteStore.addToWishlist(event); //llamada al metodo para añadir al wishlist

            console.log('Productos en favoritos:', wishlist);

        }

    });
// btn-remove-to-wishlist






































// Renderizado de la lista de deseos.

// console.log(window.location.pathname)
    const wishlistEmpty = `<div class="content-wrapper">
               
                <div class="about-content">
                    <div class="about-section">
                        <h2>Tu lista de deseos está vacía.</h2>
                       <a href="/">¡Explora nuestros productos!</a>
                    </div>

                  
                </div>
            </div>`;
    
    
    if(!isWishlistPage){
        return;
    }
    const WISHLIST = favoriteStore.wishlistLoadFromStorage();

    const detailPages = {
            ES: 'producto-detalle.html',
            EN: 'product-detail.html',
            FR: 'detail-produit.html',
            EU: 'produktu-xehetasuna.html'
    };
    const detailPage = detailPages[LANGUAGE] || 'producto-detalle.html';
    
    const wishlistContainer = document.getElementById('wishlist-container');
    if (WISHLIST.length === 0) {
        wishlistContainer.innerHTML = wishlistEmpty; //Mostrar mensaje si la lista de deseos está vacía
    } else {
        WISHLIST.forEach(producto => {
            wishlistContainer.innerHTML += `
            <article class="section-productos-destacados__item cart-item search-product-card" data-product-id="${producto.id}">
            <div class="product-image-wrapper">
                <a href="${detailPage}?pd=${producto.id}">
                    <img src="${producto.image}" alt="${producto.name}">
                </a>
                
            </div>
            <h3 class="item_title">${producto.name}</h3>
            <p class="item_description">${producto.description}</p>
            <p class="item_price">${producto.price}€</p>
            <div class="item_actions">
                <button class="btn-add-to-cart">${texts[LANGUAGE].addToCart}</button>
                <button class="btn-remove btn-remove-to-wishlist"><i class="fa-regular fa-trash-can"></i></button>
            </div>
            </article>

            
            `;
        });
    }

});