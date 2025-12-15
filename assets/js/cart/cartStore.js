
let cart = [];


export const cartStore = {
    syncStorage() {

        const jsonCart = JSON.stringify(cart);
        localStorage.setItem('cart', jsonCart);
    },
    countCart() {
        cart = this.cartLoadFromStorage();
        // console.log(cart.length);
        return cart.length; //Refleja el contador con la cantidad de productos

    },
    cartLoadFromStorage() {
        // obtengo el carrito del localStorage para operar.
        // Si no existe, lo inicializo como un array vacío.
        let cartStorage;
        const jsonCart = localStorage.getItem('cart');
        if (jsonCart) {
            cartStorage = JSON.parse(jsonCart);
        } else {
            cartStorage = [];
        }
        return cartStorage;
    },

    addToCart(param, id) {

        if (!param || !param.target || id !== undefined) {

            cart = this.cartLoadFromStorage(); //obtengo el carrito del localStorage para operar

            const element = document.querySelector(`[data-product-id="${id}"]`);
            const imgSrc = element.querySelector('.preview-image img').src;
            const name = element.querySelector('.preview-main h1').textContent;
            const price = element.querySelector('.preview-main .precio').textContent;

            if (cart.some(product => product.id === id)) {

                cart = cart.map(product => product.id === id ? { ...product, quantity: product.quantity + 1 } : product);

            } else {
                //Creo el objeto del producto
                const product = {
                    id: id,
                    name: name,
                    price: price,
                    image: imgSrc,
                    quantity: 1
                }

                cart = [...cart, product];
            }

            this.syncStorage(); //lo que tengo en array lo guardo en localStorage
            return cart;


        }

        if (param.target.classList.contains('btn-add-to-cart') && id === undefined) {

            cart = this.cartLoadFromStorage(); //obtengo el carrito del localStorage para operar

            const element = param.target.parentNode.parentNode;

            if (cart.some(product => product.id === element.getAttribute('data-product-id'))) {

                cart = cart.map(product => product.id === element.getAttribute('data-product-id') ? { ...product, quantity: product.quantity + 1 } : product);

            } else {
                //Creo el objeto del producto
                const product = {
                    id: element.getAttribute('data-product-id'),
                    name: element.querySelector('.item_title').textContent,
                    price: element.querySelector('.item_price').textContent,
                    image: element.querySelector('img').src,
                    quantity: 1
                }

                cart = [...cart, product];
            }

            this.syncStorage(); //lo que tengo en array lo guardo en localStorage
            return cart;


        }

        // });




    },

    removeItem(idProducto) {
        cart = this.cartLoadFromStorage();
        if (Array.isArray(idProducto)) {
            cart = cart.filter(product => !idProducto.includes(product.id));
        } else {
            cart = cart.filter(product => product.id !== idProducto);
        }
        this.syncStorage();
        return cart;
    },

    increaseItem(idProducto) {
        cart = this.cartLoadFromStorage();
        cart = cart.map(product => product.id === idProducto ? { ...product, quantity: product.quantity + 1 } : product);
        this.syncStorage();
        return cart;
    },

    decreaseItem(idProducto) {
        cart = this.cartLoadFromStorage();
        cart = cart.map(product => {
            if (product.id === idProducto) {
                return { ...product, quantity: Math.max(1, product.quantity - 1) };
            }
            return product;
        });
        this.syncStorage();
        return cart;
    },
    totalCart() {
        cart = this.cartLoadFromStorage();
        let total = 0;
        cart.forEach(product => {
            total += parseFloat(product.price.replace('€', '')) * product.quantity;
        });
        return total.toFixed(2);
    },
    loyaltyDiscount() {
        cart = this.cartLoadFromStorage();
        let allItems = [];

        // Expand cart items into individual product instances with their prices
        cart.forEach(product => {
            const price = parseFloat(product.price.replace('€', '').trim());
            for (let i = 0; i < product.quantity; i++) {
                allItems.push(price); // Obtengo todos los precios de los productos por su cantidad
            }
        });

        // Check if total items > 5 Si es mayor a 5 aplica el descuento
        if (allItems.length > 5) {
            // Sort by price ascending (cheapest first)
            allItems.sort((a, b) => a - b); // Ordena los precios de menor a mayor

            // Remove the 3 cheapest items (slice starting from index 3)
            const itemsToCharge = allItems.slice(3); // Quita los 3 productos mas baratos

            // Sum the remaining items
            const total = itemsToCharge.reduce((sum, price) => sum + price, 0); // Suma los precios restantes

            return total.toFixed(2); // Devuelve el total con dos decimales
        } else {
            // Return normal total if 5 or fewer items
            const total = allItems.reduce((sum, price) => sum + price, 0); // Suma los precios restantes
            return total.toFixed(2); // Devuelve el total con dos decimales
        }
    }


}

// cartStore.addToCart();