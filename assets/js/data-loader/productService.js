
const pathProducts = "/assets/data/products.json";
const pathCategories = "/assets/data/categories.json";
let language;
if (localStorage.getItem("userLanguage") !== null) {
    language = localStorage.getItem("userLanguage");
} else {
    language = "ES"; // Por defecto es español el sitio.
    localStorage.setItem("userLanguage", language);
}
// Objeto Gestor de datos

export const gestorDeDatos = {

    language: language,

    async cargarProductos() {
        const responseProducts = await fetch(pathProducts);
        const dataProducts = await responseProducts.json();
        return dataProducts; // Devuelve un array de objetos con todos los productos
    },

    async cargarProductosDestacados() {

        const dataProducts = await this.cargarProductos();
        let productosDestacados = [];

        dataProducts.forEach(product => {

            if (product.featured) {
                productosDestacados.push(product);
            }
        });

        return productosDestacados; // Devuelve un array de objetos con los productos destacados
    },

    async cargarCategorias() {
        const responseCategories = await fetch(pathCategories);
        const dataCategories = await responseCategories.json();
        return dataCategories; // Devuelve un array de objetos con las categorías
    },

    async cargarProductosPorCategoria(idCategoria) {
        const dataProducts = await this.cargarProductos();
        const productosPorCategoria = dataProducts.filter(product => product.id_categoria === idCategoria);
        return productosPorCategoria; // Devuelve un array de objetos con los productos de la categoría
    },

    async cargarProductoPorId(idProducto) {
        const dataProducts = await this.cargarProductos();
        const productoPorId = dataProducts.find(product => product.id_producto === idProducto);
        return productoPorId; // Devuelve un objeto con el producto encontrado
    },

    async cargarProductosPorNombre(nombreProducto) {
        const dataProducts = await this.cargarProductos();
        const idioma = this.language || 'ES';
        const busqueda = nombreProducto.toLowerCase().trim();
        
        const productosPorNombre = dataProducts.filter(product => {
            const nombreES = product.nombre.ES ? product.nombre.ES.toLowerCase() : '';
            const nombreEN = product.nombre.EN ? product.nombre.EN.toLowerCase() : '';
            const nombreFR = product.nombre.FR ? product.nombre.FR.toLowerCase() : '';
            const nombreEU = product.nombre.EU ? product.nombre.EU.toLowerCase() : '';
            const descripcionES = product.descripcion.ES ? product.descripcion.ES.toLowerCase() : '';
            const descripcionEN = product.descripcion.EN ? product.descripcion.EN.toLowerCase() : '';
            const descripcionFR = product.descripcion.FR ? product.descripcion.FR.toLowerCase() : '';
            const descripcionEU = product.descripcion.EU ? product.descripcion.EU.toLowerCase() : '';
            
            return nombreES.includes(busqueda) || 
                   nombreEN.includes(busqueda) || 
                   nombreFR.includes(busqueda) ||
                   nombreEU.includes(busqueda) ||
                   descripcionES.includes(busqueda) || 
                   descripcionEN.includes(busqueda) ||
                   descripcionFR.includes(busqueda) ||
                   descripcionEU.includes(busqueda);
        });
        
        return productosPorNombre; // Devuelve un array de objetos con los productos que coinciden con el nombre o descripción
    },

    // Proximamente...
    // async cargarProductosPorPrecio(precioMinimo, precioMaximo) {
    //     const dataProducts = await this.cargarProductos();
    //     const productosPorPrecio = dataProducts.filter(product => product.precio >= precioMinimo && product.precio <= precioMaximo);
    //     return productosPorPrecio; // Devuelve un array de objetos con los productos que coinciden con el precio
    // }

}
// gestorDeDatos.cargarProductos().then(data => console.log(data));
// gestorDeDatos.cargarCategorias().then(data => console.log(data));
// gestorDeDatos.cargarProductosDestacados().then(data => console.log(data));