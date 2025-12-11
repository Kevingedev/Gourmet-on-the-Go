import { authService } from './auth/authService.js';
import { cartStore } from './cart/cartStore.js';

document.addEventListener('DOMContentLoaded', () => {
    const checkoutContainer = document.getElementById('checkout-container');
    const userLanguage = authService.getLanguage() || 'ES';
    
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
        // Redirect to login page
        const url = window.location.href;
        const urlCategoria = url.split('/');
        let basePath = '';
        
        if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog' || urlCategoria[4] == 'catalogue' || urlCategoria[4] == 'katalogoa') {
            basePath = '../../../';
        } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN' || urlCategoria[3] == 'FR' || urlCategoria[3] == 'EU') {
            basePath = '../';
        } else {
            basePath = './';
        }
        
        const loginPages = {
            ES: 'sesion.html',
            EN: 'session.html',
            FR: 'connexion.html',
            EU: 'saioa.html'
        };
        const redirectPages = {
            ES: 'finalizar-compra',
            EN: 'checkout',
            FR: 'commande',
            EU: 'erosketa-bukatu'
        };
        const loginPage = loginPages[userLanguage] || 'sesion.html';
        const redirectPage = redirectPages[userLanguage] || 'finalizar-compra';
        window.location.href = `${basePath}${userLanguage}/${loginPage}?redirect=${redirectPage}`;
        return;
    }

    // Check if cart is empty
    const cart = cartStore.cartLoadFromStorage();
    if (!cart || cart.length === 0) {
        const emptyCartTexts = {
            ES: 'Tu carrito está vacío. Por favor, añade productos antes de finalizar la compra.',
            EN: 'Your cart is empty. Please add items to your cart before checkout.',
            FR: 'Votre panier est vide. Veuillez ajouter des articles avant de commander.',
            EU: 'Zure saskia hutsik dago. Mesedez, gehitu produktuak erosketa bukatu aurretik.'
        };
        const goToShopTexts = {
            ES: 'Ir a la Tienda',
            EN: 'Go to Shop',
            FR: 'Aller à la Boutique',
            EU: 'Dendara joan'
        };
        const emptyCartText = emptyCartTexts[userLanguage] || emptyCartTexts.ES;
        const goToShopText = goToShopTexts[userLanguage] || goToShopTexts.ES;
        
        checkoutContainer.innerHTML = `
            <div class="checkout-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>${emptyCartText}</p>
                <a href="${getBasePath()}${userLanguage}/" class="btn">${goToShopText}</a>
            </div>
        `;
        return;
    }

    // Load checkout form
    renderCheckoutForm();
});

function getBasePath() {
    const url = window.location.href;
    const urlCategoria = url.split('/');
    
    if (urlCategoria[4] == 'catalogo' || urlCategoria[4] == 'catalog') {
        return '../../../';
    } else if (urlCategoria[3] == 'ES' || urlCategoria[3] == 'EN') {
        return '../';
    }
    return './';
}

function renderCheckoutForm() {
    const userLanguage = authService.getLanguage() || 'ES';
    const currentUser = authService.getUser();
    const cart = cartStore.cartLoadFromStorage();
    const subtotal = parseFloat(cartStore.totalCart());
    const shippingCost = subtotal >= 49.90 ? 0 : 4.95;
    const total = subtotal + shippingCost;

    const texts = userLanguage === 'EN' ? {
        orderSummary: 'Order Summary',
        shippingInfo: 'Shipping Information',
        paymentMethod: 'Payment Method',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        freeShipping: 'Free shipping on orders over €49.90',
        total: 'Total',
        placeOrder: 'Place Order',
        fullName: 'Full Name',
        address: 'Address',
        city: 'City',
        postalCode: 'Postal Code',
        phone: 'Phone',
        email: 'Email',
        standardShipping: 'Standard Shipping',
        expressShipping: 'Express Shipping',
        storePickup: 'Store Pickup',
        creditCard: 'Credit/Debit Card',
        paypal: 'PayPal',
        cashOnDelivery: 'Cash on Delivery',
        cardNumber: 'Card Number',
        expiryDate: 'Expiry Date',
        cvv: 'CVV',
        cardholderName: 'Cardholder Name',
        items: 'items',
        item: 'item'
    } : {
        orderSummary: 'Resumen del Pedido',
        shippingInfo: 'Información de Envío',
        paymentMethod: 'Método de Pago',
        subtotal: 'Subtotal',
        shipping: 'Envío',
        freeShipping: 'Envío gratis en pedidos superiores a 49,90€',
        total: 'Total',
        placeOrder: 'Realizar Pedido',
        fullName: 'Nombre Completo',
        address: 'Dirección',
        city: 'Ciudad',
        postalCode: 'Código Postal',
        phone: 'Teléfono',
        email: 'Email',
        standardShipping: 'Envío Estándar',
        expressShipping: 'Envío Express',
        storePickup: 'Recogida en Tienda',
        creditCard: 'Tarjeta de Crédito/Débito',
        paypal: 'PayPal',
        cashOnDelivery: 'Pago Contra Reembolso',
        cardNumber: 'Número de Tarjeta',
        expiryDate: 'Fecha de Vencimiento',
        cvv: 'CVV',
        cardholderName: 'Titular de la Tarjeta',
        items: 'productos',
        item: 'producto'
    };

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemsText = totalItems === 1 ? texts.item : texts.items;

    checkoutContainer.innerHTML = `
        <div class="checkout-wrapper">
            <div class="checkout-form-section">
                <form id="checkout-form" class="checkout-form">
                    <section class="checkout-section">
                        <h2><i class="fa-solid fa-truck"></i> ${texts.shippingInfo}</h2>
                        <div class="form-group">
                            <label for="fullName">${texts.fullName} *</label>
                            <input type="text" id="fullName" name="fullName" value="${currentUser.nombre_completo || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="email">${texts.email} *</label>
                            <input type="email" id="email" name="email" value="${currentUser.email || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">${texts.phone} *</label>
                            <input type="tel" id="phone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="address">${texts.address} *</label>
                            <input type="text" id="address" name="address" required>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="city">${texts.city} *</label>
                                <input type="text" id="city" name="city" required>
                            </div>
                            <div class="form-group">
                                <label for="postalCode">${texts.postalCode} *</label>
                                <input type="text" id="postalCode" name="postalCode" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>${texts.shipping}</label>
                            <div class="shipping-options">
                                <label class="radio-option">
                                    <input type="radio" name="shipping" value="standard" checked>
                                    <div>
                                        <strong>${texts.standardShipping}</strong>
                                        <span>${shippingCost === 0 ? texts.freeShipping : `${shippingCost}€`}</span>
                                    </div>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="shipping" value="express">
                                    <div>
                                        <strong>${texts.expressShipping}</strong>
                                        <span>9,95€</span>
                                    </div>
                                </label>
                                <label class="radio-option">
                                    <input type="radio" name="shipping" value="pickup">
                                    <div>
                                        <strong>${texts.storePickup}</strong>
                                        <span>${userLanguage === 'EN' ? 'Free' : 'Gratis'}</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </section>

                    <section class="checkout-section">
                        <h2><i class="fa-solid fa-credit-card"></i> ${texts.paymentMethod}</h2>
                        <div class="payment-options">
                            <label class="radio-option">
                                <input type="radio" name="payment" value="card" checked>
                                <div>
                                    <strong>${texts.creditCard}</strong>
                                    <i class="fa-solid fa-credit-card"></i>
                                </div>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="payment" value="paypal">
                                <div>
                                    <strong>${texts.paypal}</strong>
                                    <i class="fa-brands fa-paypal"></i>
                                </div>
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="payment" value="cash">
                                <div>
                                    <strong>${texts.cashOnDelivery}</strong>
                                    <i class="fa-solid fa-money-bill-wave"></i>
                                </div>
                            </label>
                        </div>
                        <div id="card-details" class="card-details">
                            <div class="form-group">
                                <label for="cardNumber">${texts.cardNumber} *</label>
                                <input type="text" id="cardNumber" name="cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="expiryDate">${texts.expiryDate} *</label>
                                    <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" maxlength="5">
                                </div>
                                <div class="form-group">
                                    <label for="cvv">${texts.cvv} *</label>
                                    <input type="text" id="cvv" name="cvv" placeholder="123" maxlength="3">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="cardholderName">${texts.cardholderName} *</label>
                                <input type="text" id="cardholderName" name="cardholderName">
                            </div>
                        </div>
                    </section>
                </form>
            </div>

            <div class="checkout-summary-section">
                <div class="order-summary">
                    <h2><i class="fa-solid fa-receipt"></i> ${texts.orderSummary}</h2>
                    <div class="order-items">
                        ${cart.map(item => `
                            <div class="order-item">
                                <img src="${item.image}" alt="${item.name}">
                                <div class="order-item-info">
                                    <h4>${item.name}</h4>
                                    <span>${item.quantity}x ${item.price}</span>
                                </div>
                                <strong>${(parseFloat(item.price.replace('€', '')) * item.quantity).toFixed(2)}€</strong>
                            </div>
                        `).join('')}
                    </div>
                    <div class="order-totals">
                        <div class="total-row">
                            <span>${texts.subtotal}</span>
                            <span>${subtotal.toFixed(2)}€</span>
                        </div>
                        <div class="total-row">
                            <span>${texts.shipping}</span>
                            <span id="shipping-cost">${shippingCost === 0 ? (userLanguage === 'EN' ? 'Free' : 'Gratis') : `${shippingCost.toFixed(2)}€`}</span>
                        </div>
                        <div class="total-row total-final">
                            <span>${texts.total}</span>
                            <strong id="total-cost">${total.toFixed(2)}€</strong>
                        </div>
                    </div>
                    <button type="submit" form="checkout-form" class="btn-checkout">${texts.placeOrder}</button>
                    <p class="checkout-note">${totalItems} ${itemsText}</p>
                </div>
            </div>
        </div>
    `;

    // Add event listeners
    setupCheckoutForm();
}

function setupCheckoutForm() {
    const form = document.getElementById('checkout-form');
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const userLanguage = authService.getLanguage() || 'ES';

    // Update shipping cost when shipping method changes
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', updateShippingCost);
    });

    // Show/hide card details based on payment method
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', toggleCardDetails);
    });

    // Format card number input
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }

    // Format expiry date input
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', formatExpiryDate);
    }

    // Format CVV input (numbers only)
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Form submission
    form.addEventListener('submit', handleCheckoutSubmit);
}

function updateShippingCost() {
    const selectedShipping = document.querySelector('input[name="shipping"]:checked').value;
    const subtotal = parseFloat(cartStore.totalCart());
    const userLanguage = authService.getLanguage() || 'ES';
    
    let shippingCost = 0;
    if (selectedShipping === 'standard') {
        shippingCost = subtotal >= 49.90 ? 0 : 4.95;
    } else if (selectedShipping === 'express') {
        shippingCost = 9.95;
    } else if (selectedShipping === 'pickup') {
        shippingCost = 0;
    }

    const shippingCostElement = document.getElementById('shipping-cost');
    const totalCostElement = document.getElementById('total-cost');
    
    shippingCostElement.textContent = shippingCost === 0 
        ? (userLanguage === 'EN' ? 'Free' : 'Gratis')
        : `${shippingCost.toFixed(2)}€`;
    
    const total = subtotal + shippingCost;
    totalCostElement.textContent = `${total.toFixed(2)}€`;
}

function toggleCardDetails() {
    const selectedPayment = document.querySelector('input[name="payment"]:checked').value;
    const cardDetails = document.getElementById('card-details');
    
    if (selectedPayment === 'card') {
        cardDetails.style.display = 'block';
        // Make card fields required
        document.getElementById('cardNumber').required = true;
        document.getElementById('expiryDate').required = true;
        document.getElementById('cvv').required = true;
        document.getElementById('cardholderName').required = true;
    } else {
        cardDetails.style.display = 'none';
        // Remove required attribute
        document.getElementById('cardNumber').required = false;
        document.getElementById('expiryDate').required = false;
        document.getElementById('cvv').required = false;
        document.getElementById('cardholderName').required = false;
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    const userLanguage = authService.getLanguage() || 'ES';
    const formData = new FormData(e.target);
    const checkoutData = {
        shipping: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode'),
            method: formData.get('shipping')
        },
        payment: {
            method: formData.get('payment'),
            cardNumber: formData.get('cardNumber'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv'),
            cardholderName: formData.get('cardholderName')
        },
        cart: cartStore.cartLoadFromStorage(),
        total: document.getElementById('total-cost').textContent
    };

    // Here you would typically send this data to a server
    // For now, we'll just show a success message and clear the cart
    const successMessage = userLanguage === 'EN' 
        ? 'Order placed successfully! Thank you for your purchase.'
        : '¡Pedido realizado con éxito! Gracias por tu compra.';

    alert(successMessage);
    
    // Clear cart
    cartStore.removeItem(cartStore.cartLoadFromStorage().map(item => item.id));
    
    // Redirect to home
    const basePath = getBasePath();
    window.location.href = `${basePath}${userLanguage}/`;
}

