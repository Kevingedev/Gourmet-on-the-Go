
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

    addToCart(param) {

        if (!param || !param.target) {
            return;
        }

        //const cartDrawerTotal = document.querySelector('.cart-drawer__total strong');//Mostrar el resultado total
        // const productInCart = document.querySelector('.cart-item');
        // const productList = document.querySelector('.container-products');

        // productList.addEventListener('click', (event) => {

        if (param.target.classList.contains('btn-add-to-cart')) {

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

            // console.log(cart);
            // this.countCart();
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
    }


}

// cartStore.addToCart();