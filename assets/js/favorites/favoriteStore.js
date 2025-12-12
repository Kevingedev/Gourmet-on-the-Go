
let wishlist = [];


export const favoriteStore = {

    syncStorage() {

        const jsonWishlist = JSON.stringify(wishlist);
        localStorage.setItem('wishlist', jsonWishlist);
    },
    wishlistLoadFromStorage() {
        // obtengo el carrito del localStorage para operar.
        // Si no existe, lo inicializo como un array vacío.
        let wishlistStorage;
        const jsonWishlist = localStorage.getItem('wishlist');
        if (jsonWishlist) {
            wishlistStorage = JSON.parse(jsonWishlist);
        } else {
            wishlistStorage = [];
        }
        return wishlistStorage;
    },
    addToWishlist(param) {

        if (!param || !param.target) {
            return;
        }

        // productList.addEventListener('click', (event) => {

        if (param.target.classList.contains('btn-add-to-wishlist')) {

            wishlist = this.wishlistLoadFromStorage(); //obtengo el carrito del localStorage para operar

            const element = param.target.parentNode.parentNode;

            if (!wishlist.some(product => product.id === element.getAttribute('data-product-id'))) {

                // wishlist = wishlist.map(product => product.id === element.getAttribute('data-product-id') ? { ...product, quantity: product.quantity + 1 } : product);

            /* } 
            else { */
                //Creo el objeto del producto
                const product = {
                    id: element.getAttribute('data-product-id'),
                    name: element.querySelector('.item_title').textContent,
                    description: element.querySelector('.item_description').textContent,
                    price: element.querySelector('.item_price').textContent,
                    image: element.querySelector('img').src
                }

                wishlist = [...wishlist, product];

                // wishlist = [{},{},{}, product];

            }

            this.syncStorage(); //lo que tengo en array lo guardo en localStorage
            return wishlist;

        }




    },
    removeItem(idProducto) {
        wishlist = this.wishlistLoadFromStorage();
        if (Array.isArray(idProducto)) {
            wishlist = wishlist.filter(product => !idProducto.includes(product.id));
        } else {
            wishlist = wishlist.filter(product => product.id !== idProducto);
        }
        this.syncStorage();
        return wishlist;
    },
    totalWishlist() {
        wishlist = this.wishlistLoadFromStorage();
        let total = 0;
        wishlist.forEach(product => {
            total += parseFloat(product.price.replace('€', '')) * product.quantity;
        });
        return total.toFixed(2);
    }

}