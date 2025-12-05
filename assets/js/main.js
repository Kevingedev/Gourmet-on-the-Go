import { gestorDeDatos } from "./data-loader/productService.js";

const featuredProductsLoader = document.getElementById('featured-products-loader');
const LANGUAGE = gestorDeDatos.language;

gestorDeDatos.cargarProductosDestacados().then(productos => {
   
    productos.forEach(producto => {
        featuredProductsLoader.innerHTML += `
        <article class="section-productos-destacados__item">
            <img src="../assets/img/img-test.jpg" alt="${producto.nombre[LANGUAGE]}">
            <h3 class="item_title">${producto.nombre[LANGUAGE]}</h3>
            <p class="item_description">${producto.descripcion[LANGUAGE]}</p>
            <p class="item_price">${producto.precio}€</p>
            <div class="item_actions">
                <button class="btn-add-to-cart">Añadir</button>
                <button class="btn-favorite"><i class="fa-solid fa-heart"></i></button>
            </div>
        </article>
        `;
    });

});