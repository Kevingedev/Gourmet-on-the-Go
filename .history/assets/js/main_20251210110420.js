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
}