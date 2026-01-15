# Gourmet-on-the-Go: Instrucciones para Agentes de IA

## Descripción General del Proyecto

**Gourmet-on-the-Go** es una plataforma de e-commerce multiidioma para alimentos precocinados gourmet, construida con JavaScript vanilla (módulos ES6), HTML5 y CSS3. Sin frameworks—gestión de datos del lado del cliente con persistencia en localStorage.

### Patrón de Arquitectura Central
- **Punto de Entrada Único**: [main.js](../main.js) detecta idioma y redirige a carpeta de idioma (ES/EN/FR/EU)
- **Capa de Datos**: [assets/js/data-loader/productService.js](../assets/js/data-loader/productService.js) maneja obtención de productos/categorías vía export `gestorDeDatos`
- **Gestión de Estado**: Almacenes basados en localStorage ([cartStore](../assets/js/cart/cartStore.js), [favoriteStore](../assets/js/favorites/favoriteStore.js), [authService](../assets/js/auth/authService.js))
- **Enrutamiento por Idioma**: La estructura de URL determina el idioma activo (ej: `/ES/index.html` → Español)

## Conocimiento Crítico para Agentes

### 1. Detección de Idioma y Cálculo de Rutas (CRÍTICO)
Todo módulo debe calcular dinámicamente las rutas de assets según la profundidad de URL. Usa el patrón `getBasePath()`:
```javascript
// De productService.js líneas 4-22
if (upperParts.some(p => ['CATALOGO', 'CATALOG', 'CATALOGUE', 'KATALOGOA'].includes(p))) {
    return '../../../';  // Páginas de catálogo profundas
} else if (upperParts.some(p => ['ES', 'EN', 'FR', 'EU'].includes(p))) {
    return '../';        // Páginas en carpeta de idioma
} else {
    return './';         // Nivel raíz
}
```
**Por qué**: Las carpetas de idioma tienen profundidad 2; páginas de catálogo profundidad 4. Las rutas relativas fallan si esto es incorrecto.

**Almacenamiento de Idioma**: Siempre usa `localStorage.setItem('userLanguage', lang)` y lee desde URL primero vía `detectLanguageFromUrl()`.

### 2. Estructura de Datos: Objetos JSON Multiidioma
Todos los productos, categorías y textos visibles usan este patrón:
```json
{
  "nombre": {
    "ES": "Pollo Asado",
    "EN": "Roasted Chicken", 
    "FR": "Poulet Rôti",
    "EU": "Oilaskoa Errea"
  }
}
```
**Archivos Clave**: [products.json](../assets/data/products.json), [categories.json](../assets/data/categories.json)
- Acceso vía: `product.nombre[gestorDeDatos.language]`
- Todo texto de UI debe soportar 4 idiomas

### 3. Gestión de Estado vía Almacenes localStorage
Tres almacenes centrales siguen este patrón (objeto export con métodos):

**[cartStore](../assets/js/cart/cartStore.js)** (Líneas 4-173):
- `cartLoadFromStorage()` → recupera array del carrito
- `addToCart(event, id)` → soporta llamadas basadas en evento e ID directo
- `syncStorage()` → persiste en clave localStorage `'cart'`
- **Descuento por Lealtad**: Si hay >5 ítems totales, los 3 más baratos son gratis

**[favoriteStore](../assets/js/favorites/favoriteStore.js)** (Líneas 4-115):
- Mismo patrón: `wishlistLoadFromStorage()`, `addToWishlist()`, `syncStorage()`
- Clave localStorage: `'wishlist'`
- Emite evento `favoritesUpdated` para actualizar contadores de nav

**[authService](../assets/js/auth/authService.js)** (Líneas 3-111):
- `login(user)`, `logout()` → almacena/limpia clave `'currentUser'`
- `getUser()` → retorna currentUser parseado o null
- `getAvatar()` → genera iniciales o retorna foto de Google
- Usuarios cargados desde [assets/data/users.json](../assets/data/users.json)

### 4. Estrategia de Importación de Módulos
Siempre usa **importaciones ES6 estáticas** al inicio para módulos principales:
```javascript
import { gestorDeDatos } from './data-loader/productService.js';
import { cartStore } from './cart/cartStore.js';
```
**Excepción**: Usa importaciones dinámicas `await import()` solo para componentes cargados condicionalmente (ej: página de detalle de producto).

### 5. Convención de Atributos de Datos del DOM
Los productos usan atributos de datos estandarizados para operaciones de carrito/favoritos:
```html
<div class="cart-item" data-product-id="PM001">
  <img class="preview-image" src="...">
  <h1 class="item_title">Nombre del Producto</h1>
  <span class="precio">14.99€</span>
  <button class="btn-add-to-cart">Añadir</button>
  <button class="btn-favorite">♥</button>
</div>
```
- `data-product-id`: Siempre requerido para operaciones de carrito/wishlist
- Selectores de clase están codificados en [cartStore.addToCart()](../assets/js/cart/cartStore.js#L25-L35)—cambiarlos rompe la funcionalidad

### 6. Autenticación y Protección por Rol
[middleware.js](../assets/js/auth/middleware.js) exporta `protectPage()`:
- Verifica `authService.isAuthenticated()`
- Redirige a página de sesión si no está autenticado
- Panel admin ([admin/app/](../admin/app/)) espera `currentUser.rol === 'admin'`

**Dos métodos de autenticación**:
1. **Estándar**: Usuario/contraseña desde users.json (validado en [authService.validateLogin()](../assets/js/auth/authService.js#L40-L90))
2. **Google OAuth**: [googleAuth.js](../assets/js/auth/googleAuth.js) maneja flujo de Sign-In con Google

### 7. Integración JSON-Server (Desarrollo)
Ejecuta `npm run server` para iniciar json-server en puerto 3001:
- Vigila [db.json](../db.json) para actualizaciones de API en vivo
- Panel admin usa esto para operaciones CRUD (ver [admin/app/products/](../admin/app/products/))
- **Para trabajo de funcionalidades**: Si añades funcionalidad admin, comunícate con endpoints `/api/products`, `/api/users`

### 8. Diseño Responsivo y CSS Modular
- Hoja de estilos base: [assets/css/styles.css](../assets/css/styles.css) (global)
- Específica por funcionalidad: [assets/css/checkout.css](../assets/css/checkout.css), [cart/cartView.css](../assets/css/)
- **Sistema de variables**: Ver [assets/css/vars.css](../assets/css/vars.css) para tokens de color/espaciado
- Puntos de ruptura mobile-first en cada hoja de estilos

## Flujos de Trabajo y Tareas Comunes

### Añadir Nueva Funcionalidad de Producto
1. Extiende objeto de producto en [products.json](../assets/data/products.json)
2. Actualiza lógica de búsqueda en [productService.cargarProductosPorNombre()](../assets/js/data-loader/productService.js#L110-L130) si es necesario
3. Actualiza plantillas del DOM para renderizar nuevos campos (usa selectores multiidioma)
4. Prueba cálculo de rutas: verifica que assets carguen desde 3 niveles de profundidad (raíz, /ES/, /ES/catalogo/)

### Corregir Errores Multiidioma
- **Siempre verifica**: ¿`gestorDeDatos.language` retorna valor correcto?
- Debug localStorage: `console.log(localStorage.getItem('userLanguage'))`
- Verifica que estructura JSON tenga 4 claves de idioma (ES/EN/FR/EU)

### Cambios en Lógica de Carrito/Favoritos
- Prueba con llamadas basadas en evento (clics) e ID directo
- Siempre llama `syncStorage()` después de mutaciones
- Recuerda: decreaseItem() no elimina cuando cantidad es 1 (usa `removeItem()`)
- Descuento por lealtad se recalcula en `totalCart()`, no en addToCart()

## Servidor de Desarrollo y Pruebas

```bash
# Terminal 1: JSON Server (API admin)
npm run server

# Terminal 2: Servidor HTTP (para evitar CORS)
# Python 3:
python -m http.server 8000

# Acceso:
http://localhost:8000/ES/index.html
http://localhost:3001/  # UI Admin JSON Server
```

## Referencia Rápida de Estructura de Archivos
```
assets/js/
  ├── data-loader/productService.js       # Central: detección idioma, obtención productos
  ├── auth/authService.js                 # Login/logout/estado usuario
  ├── auth/middleware.js                  # Protección de páginas
  ├── cart/cartStore.js                   # Estado carrito + lógica lealtad
  ├── favorites/favoriteStore.js          # Estado wishlist
  └── product-detail/producto-detalle.js  # Lógica vista detalle producto

ES|EN|FR|EU/
  ├── index.html                          # Página inicio específica idioma
  ├── catalogo/[category]/index.html      # Páginas exploración categoría
  └── producto-detalle.html               # Plantilla detalle producto

admin/app/
  ├── products/                           # Gestionar productos (usa json-server)
  ├── users/                              # Gestionar usuarios (usa json-server)
  └── orders/                             # Panel pedidos
```

## Convenciones que Este Proyecto Rompe
- **Sin paso de compilación**: Distribuye módulos ES6 directamente (navegadores soportan `type="module"`)
- **Sin enrutador SPA**: Sitio tradicional multi-página con enrutamiento basado en carpetas
- **Sin librería de estado**: localStorage + event emitters en lugar de Redux/Vuex
- **Sin framework CSS**: CSS personalizado con tokens de sistema de diseño en vars.css

## Patrones Conocidos para Preservar
1. **Carga perezosa**: Imágenes en listados de productos usan `loading="lazy"` para reducir carga inicial
2. **localStorage como caché**: Todos los almacenes leen desde localStorage al cargar página para prevenir re-fetch
3. **Delegación de eventos**: Botones de carrito/favoritos usan bubbling de eventos a elemento padre
4. **Accesibilidad**: Iconos de Font Awesome tienen etiquetas ARIA; inputs de formulario tienen labels asociados
