
let wishlist = [];


export const favoriteStore = {

    syncStorage() {
        const jsonWishlist = JSON.stringify(wishlist);
        localStorage.setItem('wishlist', jsonWishlist);
        // Dispatch event to update nav count
        window.dispatchEvent(new Event('favoritesUpdated'));
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

        // Check for both button classes
        const isFavoriteButton = param.target.classList.contains('btn-add-to-wishlist') || 
                                  param.target.closest('.btn-favorite') ||
                                  param.target.closest('.btn-add-to-wishlist');

        if (isFavoriteButton) {
            wishlist = this.wishlistLoadFromStorage(); //obtengo el carrito del localStorage para operar

            // Find the product card element
            const element = param.target.closest('.cart-item') || 
                           param.target.closest('.search-product-card') ||
                           param.target.closest('[data-product-id]') ||
                           param.target.parentNode.parentNode;

            const productId = element.getAttribute('data-product-id');

            if (!productId) {
                console.warn('No product ID found');
                return wishlist;
            }

            // Check if product is already in wishlist
            if (!wishlist.some(product => product.id === productId)) {
                // Create product object
                const product = {
                    id: productId,
                    name: element.querySelector('.item_title')?.textContent?.trim() || '',
                    description: element.querySelector('.item_description')?.textContent?.trim() || '',
                    price: element.querySelector('.item_price')?.textContent?.trim() || '0€',
                    image: element.querySelector('img')?.src || ''
                };

                wishlist = [...wishlist, product];
                this.syncStorage(); // Save to localStorage
            } else {
                // If already in wishlist, remove it (toggle behavior)
                wishlist = wishlist.filter(product => product.id !== productId);
                this.syncStorage();
            }

            return wishlist;
        }

        return wishlist;
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
    countWishlist() {
        wishlist = this.wishlistLoadFromStorage();
        return wishlist.length;
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