# Documentación Técnica: Gestión de Productos y Carrito de Compras

Este documento explica el funcionamiento de los archivos `productService.js` y `cartStore.js`, componentes fundamentales para la lógica de datos y el manejo del carrito de compras en la aplicación.

Está diseñado para que cualquier desarrollador nuevo comprenda rápidamente cómo se obtienen los datos y cómo se gestiona el estado del carrito.

---

## 1. `productService.js` - Gestor de Datos

**Ubicación:** `assets/js/data-loader/productService.js`

Este archivo es el encargado de **obtener y filtrar la información** de la tienda (productos y categorías). Actúa como una capa de servicio que conecta la aplicación con los archivos JSON de datos (`products.json` y `categories.json`).

### Funcionalidades Principales

El objeto principal exportado es `gestorDeDatos`.

*   **Detección de Idioma (`language`):**
    *   Detecta automáticamente el idioma del usuario basándose en la URL actual (ej. `/ES/`, `/EN/`).
    *   Si no encuentra el idioma en la URL, recurre a `localStorage` o usa "ES" (Español) por defecto.
    *   Esto permite que las búsquedas y datos se adapten al idioma del visitante.

*   **Carga de Productos (`cargarProductos`):**
    *   Realiza una petición (`fetch`) al archivo `/assets/data/products.json`.
    *   Devuelve la lista completa de productos.

*   **Carga de Categorías (`cargarCategorias`):**
    *   Realiza una petición (`fetch`) al archivo `/assets/data/categories.json`.
    *   Devuelve la lista de categorías disponibles.

*   **Filtrado de Productos:**
    *   `cargarProductosDestacados()`: Filtra y devuelve solo los productos marcados como destacados (`featured: true`).
    *   `cargarProductosPorCategoria(idCategoria)`: Devuelve productos que pertenecen a una categoría específica.
    *   `cargarProductoPorId(idProducto)`: Busca un producto único por su ID.
    *   `cargarProductosPorNombre(nombreProducto)`: Realiza una búsqueda de texto en el nombre y descripción del producto. Es **multilingüe**, buscando coincidencias en Español, Inglés, Francés y Euskera.

### Ejemplo de Uso
```javascript
import { gestorDeDatos } from './data-loader/productService.js';

// Obtener todos los productos destacados
const destacados = await gestorDeDatos.cargarProductosDestacados();

// Buscar un producto por ID
const producto = await gestorDeDatos.cargarProductoPorId('P001');
```

---

## 2. `cartStore.js` - Gestor del Carrito

**Ubicación:** `assets/js/cart/cartStore.js`

Este archivo maneja toda la lógica del **carrito de compras**. Su principal responsabilidad es mantener el estado del carrito persistente utilizando el `localStorage` del navegador, para que los datos no se pierdan si el usuario recarga la página.

### Funcionalidades Principales

El objeto principal exportado es `cartStore`.

*   **Sincronización (`syncStorage` y `cartLoadFromStorage`):**
    *   Guarda y recupera el array del carrito en el `localStorage` del navegador bajo la clave `'cart'`.
    *   Cada vez que se modifica el carrito, se guarda automáticamente.

*   **Añadir al Carrito (`addToCart`):**
    *   Puede recibir un evento (click en botón) o un ID directo.
    *   Si el producto ya existe en el carrito, incrementa su cantidad.
    *   Si es nuevo, crea un objeto producto con `id`, `name`, `price`, `image` y `quantity` (cantidad inicial 1).
    *   **Nota:** Extrae información del DOM (HTML) si se usa mediante eventos de click.

*   **Modificar Cantidades:**
    *   `increaseItem(id)`: Suma 1 a la cantidad del producto.
    *   `decreaseItem(id)`: Resta 1. Si la cantidad llega a 1 y se resta, se mantiene en 1 (no elimina, para eliminar usar `removeItem`).
    *   `removeItem(id)`: Elimina el producto completamente del carrito.

*   **Cálculos:**
    *   `countCart()`: Devuelve el número total de ítems únicos (longitud del array del carrito).
    *   `totalCart()`: Calcula el precio total sumando `precio * cantidad` de todos los productos.
    *   `loyaltyDiscount()`: Lógica especial de descuento.
        *   Si hay **más de 5 artículos individuales** en total:
        *   Ordena todos los precios de menor a mayor.
        *   **Regala (descuenta) los 3 artículos más baratos**.
        *   Cobra solo el resto.

### Ejemplo de Uso
```javascript
import { cartStore } from './cart/cartStore.js';

// Añadir un producto (si se tiene el ID)
cartStore.addToCart(null, 'P001');

// Obtener el total del carrito
const total = cartStore.totalCart();

// Eliminar un producto
cartStore.removeItem('P001');
```

---

## Resumen de Interacción

1.  La página web usa **`productService.js`** para pintar los productos en la pantalla.
2.  Cuando el usuario hace click en "Añadir", se invoca a **`cartStore.js`**.
3.  **`cartStore.js`** lee los datos del ítem seleccionado y los guarda en el navegador (`localStorage`).
4.  Otras páginas (como el checkout o la vista del carrito) leen este `localStorage` a través de `cartStore` para mostrar lo que el usuario ha comprado.
