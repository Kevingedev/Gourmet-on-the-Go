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
- 🌐 **Multi-idioma** / Multi-language Support (ES, EN, FR, EU)
- 💳 **Proceso de Checkout Completo** / Complete Checkout Process
- 📦 **Gestión de Categorías** / Category Management
- 👥 **Perfiles de Usuario** / User Profiles

## 🛠️ Tecnologías / Technologies

- **HTML5** - Estructura semántica
- **CSS3** - Estilos y diseño responsive
- **JavaScript (ES6+)** - Lógica de la aplicación con módulos ES6
- **JSON** - Almacenamiento de datos (productos, categorías, usuarios)

## 📁 Estructura del Proyecto / Project Structure

```
Gourmet-on-the-Go/
├── assets/
│   ├── css/              # Estilos CSS modulares
│   ├── js/               # Código JavaScript
│   │   ├── auth/         # Sistema de autenticación
│   │   ├── cart/         # Gestión del carrito
│   │   ├── favorites/    # Sistema de favoritos
│   │   ├── data-loader/  # Carga de datos
│   │   └── product-detail/ # Detalles de productos
│   ├── data/             # Archivos JSON (productos, categorías, usuarios)
│   ├── img/              # Imágenes y recursos visuales
│   ├── fonts/            # Fuentes personalizadas
│   └── icons/            # Iconos (Font Awesome)
├── ES/                   # Páginas en Español
├── EN/                   # Páginas en Inglés
├── FR/                   # Páginas en Francés
├── EU/                   # Páginas en Euskera
├── index.html            # Página principal (redirección)
└── main.js               # Script principal
```

## 🚀 Inicio Rápido / Quick Start

1. **Clonar el repositorio** / Clone the repository
   ```bash
   git clone <repository-url>
   cd Gourmet-on-the-Go
   ```

2. **Abrir en un servidor local** / Open in a local server
   
   Para desarrollo local, se recomienda usar un servidor HTTP. Puedes usar:
   For local development, an HTTP server is recommended. You can use:
   
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

3. **Abrir en el navegador** / Open in browser
   ```
   http://localhost:8000
   ```

## 📋 Funcionalidades Principales / Main Functionalities

### Autenticación / Authentication
- Registro e inicio de sesión
- Autenticación con Google
- Gestión de sesiones
- Perfiles de usuario

### Catálogo de Productos / Product Catalog
- Visualización por categorías:
  - 🍳 Desayunos / Breakfast
  - 🥩 Carnes / Meat
  - 🐟 Mariscos / Seafood
  - 🥗 Complementos / Complements
- Detalles de productos
- Búsqueda avanzada

### Carrito de Compras / Shopping Cart
- Agregar/eliminar productos
- Actualizar cantidades
- Cálculo automático de totales
- Persistencia en localStorage

### Checkout / Finalización de Compra
- Proceso de compra paso a paso
- Información de envío
- Métodos de pago
- Confirmación de pedido

## 📝 Datos de Ejemplo / Sample Data

Los datos se almacenan en archivos JSON dentro de `assets/data/`:
- `products.json` - Catálogo de productos
- `categories.json` - Categorías disponibles
- `users.json` - Usuarios registrados

## 🌐 Idiomas Soportados / Supported Languages

- 🇪🇸 **Español (ES)** - `/ES/`
- 🇬🇧 **English (EN)** - `/EN/`
- 🇫🇷 **Français (FR)** - `/FR/`
- 🇪🇺 **Euskera (EU)** - `/EU/`

## 🎨 Estilos / Styling

El proyecto utiliza CSS modular organizado por componentes:
- `main.css` - Estilos principales
- `nav.css` - Navegación
- `footer.css` - Pie de página
- `checkout.css` - Proceso de checkout
- `modal.css` - Modales y popups
- `vars.css` - Variables CSS

## 🔧 Desarrollo / Development

### Estructura de Módulos JavaScript

El código JavaScript está organizado en módulos ES6:
- `authService.js` - Servicio de autenticación
- `cartStore.js` - Gestión del estado del carrito
- `productService.js` - Servicio de productos
- `favoriteStore.js` - Gestión de favoritos

## 👥 Equipo / Team

### Achraf RZZ
- 🔗 [LinkedIn](https://www.linkedin.com/in/achrafrzz/)

### Kevin Ruiz
- 🔗 [GitHub](https://github.com/Kevingedev/)

### German Illan
- 🔗 [GitHub](https://github.com/German2024279/)

## 📄 Licencia / License

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

This project is open source and available under the MIT License.

## 👥 Contribuciones / Contributions

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.

Contributions are welcome. Please open an issue or pull request for any improvements.

---

**Desarrollado con ❤️ para amantes de la comida gourmet**

**Developed with ❤️ for gourmet food lovers**
