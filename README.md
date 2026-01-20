# Gourmet-on-the-Go - Online Shop

Una tienda online de alimentos precocinados gourmet, creada con HTML5, CSS3, JavaScript y JSON.

An online shop for gourmet precooked food, built with HTML5, CSS3, JavaScript, and JSON.

## 🌍 Descripción / Description

Gourmet-on-the-Go es una tienda online completa para la venta de alimentos precocinados de alta calidad. La aplicación soporta múltiples idiomas (Español, Inglés, Francés y Euskera) y ofrece una experiencia de compra completa con carrito de compras, sistema de autenticación, favoritos y proceso de checkout.

Gourmet-on-the-Go is a complete online shop for selling high-quality precooked food. The application supports multiple languages (Spanish, English, French, and Basque) and offers a complete shopping experience with shopping cart, authentication system, favorites, and checkout process.

## ✨ Características / Features

- 🛒 **Carrito de Compras** / Shopping Cart
- 👤 **Sistema de Autenticación** / Authentication System (incluye Google Auth)
- ❤️ **Favoritos** / Favorites/Wishlist
- 🔍 **Búsqueda de Productos** / Product Search
- 📱 **Diseño Responsive** / Responsive Design
# Gourmet-on-the-Go — Tienda Online (Frontend estático)

Una aplicación multiidioma de e-commerce construida con HTML5, CSS3 y JavaScript (módulos ES6). Está diseñada como un frontend tradicional (páginas estáticas organizadas por idioma) y utiliza archivos JSON para datos de ejemplo. El objetivo del repositorio es educativo y práctico: servir como plantilla para aprender patrones de estructura, localStorage-based state management y comunicación con una API de desarrollo (json-server).

**Estado:** Frontend estático completo + API de desarrollo mediante `json-server` (db en `assets/data/`).

**Nota rápida:** El proyecto no depende de un backend real en producción por defecto. Para desarrollo se incluye `db.js` que conecta los JSON de `assets/data/` con `json-server`.

**Índice rápido**
- **Requisitos** y cómo arrancar
- **Arquitectura** y puntos clave (multi-idioma, carga de assets, stores)
- **Datos**: formato multi-idioma
- **Comandos útiles**
- **Tips de desarrollo y debugging**

**Requisitos**
- Node.js (para `json-server` si vas a usar la API de desarrollo)
- Un servidor estático para servir las páginas (por ejemplo `python -m http.server` o `npx http-server`)

**Instalación (rápida)**
1. Clona el repositorio:

```bash
git clone <repository-url>
cd Gourmet-on-the-Go-Online-Shop
```

2. Instala dependencias de desarrollo (solo `json-server` está en `package.json`):

```bash
npm install
```

3. Variables de entorno (opcional):
- Usa `.env.example` como referencia. Crea un archivo `.env` local para ajustar puertos o rutas (ya añadimos `.env` en el repo y `.env` está ignorado por Git).

**Correr servidor de datos (json-server)**
El proyecto incluye un `package.json` con un script `dev` que arrancará `json-server` usando `assets/data/db.js`.

```bash
# Levanta json-server en http://localhost:3005
npm run dev
```

`json-server` servirá endpoints REST como `GET /products`, `GET /categories`, `GET /users`, `GET /orders` — útiles para pruebas del panel admin.

**Servir el frontend (páginas estáticas)**
Puedes usar un servidor estático cualquiera. Ejemplos:

```bash
# Python 3
python -m http.server 8000

# Node http-server
npx http-server -p 5501

# Luego abre en el navegador:
http://localhost:8000
```

**Arquitectura y puntos clave**

- **Estructura por idioma:** las páginas se organizan en carpetas `ES/`, `EN/`, `FR/`, `EU/`. El archivo `main.js` detecta el idioma y redirige a la carpeta apropiada.
- **Carga de datos:** `assets/js/data-loader/productService.js` es la capa de datos. Por defecto intenta consumir `http://localhost:3005/products` (json-server) y tiene lógica para calcular rutas a recursos estáticos según la profundidad de la URL.
- **Formato multi-idioma:** los productos y categorías usan objetos con claves por idioma. Ejemplo:

```json
"nombre": { "ES": "Pollo Asado", "EN": "Roasted Chicken", "FR": "Poulet Rôti", "EU": "Oilaskoa Errea" }
```

- **Almacenamiento del estado:** El frontend utiliza `localStorage` para persistir carrito (`'cart'`), favoritos (`'wishlist'`) y sesión (`'currentUser'`). Los módulos relevantes están en `assets/js/cart/`, `assets/js/favorites/` y `assets/js/auth/`.

- **Reglas del carrito:** `cartStore` contiene la lógica de negocio: contadores, incremento/decremento, cálculo del total y una función `loyaltyDiscount()` que aplica una promoción (si hay más de 5 items, los 3 más baratos son gratis). Revisa `assets/js/cart/cartStore.js` para entender el cálculo y adaptar la política.

- **Protección de páginas:** `assets/js/auth/middleware.js` exporta `protectPage()` que redirige a la página de inicio de sesión cuando el usuario no está autenticado.

**API de desarrollo (json-server)**
- Endpoints principales:
  - `GET /products` — lista de productos
  - `GET /products/:id` — producto por `id` (json-server agrega `id` automático)
  - `GET /products?id_producto=PM001` — búsqueda por `id_producto` original
  - `POST /products`, `PUT /products/:id`, `DELETE /products/:id` — operaciones de CRUD (útiles para panel admin)

Ejemplo `curl`:

```bash
# Obtener productos
curl http://localhost:3005/products

# Buscar por id_producto
curl "http://localhost:3005/products?id_producto=PM001"
```

**Buenas prácticas y recomendaciones**

- Mantén `assets/data/` como data de ejemplo. Para producción reemplaza por una API real.
- Comprueba que `gestorDeDatos.language` devuelva el idioma correcto antes de renderizar texto multi-idioma.
- Evita cambiar selectores y `data-*` attributes usados por `cartStore`/`favoriteStore` (p. ej. `data-product-id`), porque partes del código dependen de ellos.
- Si trabajas con `json-server`, revisa `assets/data/db.js` (resume los JSON), y usa `npm run dev` para levantar la API de desarrollo.

**Debugging rápido**

- Si los assets no cargan, confirma la ruta base calculada en `assets/js/data-loader/productService.js` (función `getBasePath()`).
- Si `validateLogin()` no encuentra usuarios, verifica `http://localhost:3005/users` y que el script `npm run dev` esté corriendo.
- Para ver el contenido del carrito y favoritos en tiempo real, usa `localStorage` desde la consola del navegador:

```js
JSON.parse(localStorage.getItem('cart'))
JSON.parse(localStorage.getItem('wishlist'))
```

**Comandos útiles**

- Instalar dependencias

```bash
npm install
```

- Levantar json-server (API de desarrollo)

```bash
npm run dev
```

- Servir frontend estático (ej. con Python)

```bash
python -m http.server 8000
```

**Contribuir**

- Forkea, crea branch con nombre descriptivo (`feature/<nombre>` o `fix/<issue>`), abre PR y describe los cambios.
- Añade tests manuales o scripts de verificación cuando modifiques lógica del carrito, autenticación o la estructura de datos.

**Licencia**

Proyecto bajo licencia **MIT**. Consulta el archivo `LICENSE` si existe o añade uno si vas a publicar.

**Contacto y autores**

- Kevin Ruiz — `https://github.com/Kevingedev`
- Achraf RZZ — `https://www.linkedin.com/in/achrafrzz/`
- German Illan — `https://github.com/German2024279/`
- Mirel Volcán — `hhttps://github.com/MirelSIG`

---