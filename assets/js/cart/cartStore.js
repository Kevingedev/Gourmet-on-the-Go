
let cart = [];


export const cartStore = {
    syncStorage() {

        const jsonCart = JSON.stringify(cart);
        localStorage.setItem('cart', jsonCart);
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
    removeFromCart(param) {

        if (!param || !param.target) {
            return;
        }

        if (param.target.classList.contains('btn-remove')) {
            cart = this.cartLoadFromStorage();
            const element = param.target.parentNode.parentNode.parentNode; //Aqui llego hasta el div cart-item

            console.log(element.getAttribute('data-product-id'));
            cart = cart.filter(product => product.id !== element.getAttribute('data-product-id')); /* 
            Filtra el array cart para eliminar el producto que se quiera eliminar
            */
            // console.log(cart);
            // this.countCart();
            this.syncStorage(); //Sincronizo el localStorage sin el elemento eliminado
            return cart;
        }

    },
    countCart() {
        cart = this.cartLoadFromStorage();
        // console.log(cart.length);
        return cart.length; //Refleja el contador con la cantidad de productos

    },
    amountCart() {
        cart = this.cartLoadFromStorage();
        let total = 0;
        for (const product of cart) {
            total += parseFloat(product.price.replace('€', '')) * product.quantity;
        }
        return total.toFixed(2);

    }

}

// cartStore.addToCart();