document.addEventListener('DOMContentLoaded', () => {
    const modalContainer = document.getElementById('modalContainer');

    // Insertar el popup

    modalContainer.innerHTML = `
    <div class="popup_content">
            
            <button class="popup_close_btn">&times;</button>
            
            <h2 class="popup_title">¡CODIGO de primera Compra!</h2>
            
            <p class="popup_description">
                ¿Cansado de cocinar? obten hoy un CODIGO: <span class="popup_discount">15% de descuento</span> en tu primer pedido de comidas precocinadas, listas en 5 minutos. ¡Sabor y Nutrición garantizados!
            </p>


                <input type="text" class="popup_input" placeholder="example@example.com">
                
                <ul class="popup_list">
                    <li class="popup_list_item">
                        <span class="popup_class_name">Comidas listas en minutos</span>
                    </li>
                    <li class="popup_list_item">
                        <span class="popup_class_name">Recetas saludables y variadas</span>
                    </li>
                    <li class="popup_list_item">
                        <span class="popup_class_name">Envío rápido a tu domicilio</span>
                    </li>
                </ul>

                <button type="button" class="popup_btn" id="subscribeBtn">
                    ¡Quiero mi 15% de Descuento!
                </button>

        </div>`;


    const closeButton = document.querySelector('.popup_close_btn');
    const acceptButton = document.getElementById('subscribeBtn');
    // const emailInput = document.querySelector('.popup_input');
    /**
     * Función para mostrar el popup
     */
    const showPopup = () => {
        if (modalContainer) {
            // Elimina la clase 'hidden' para mostrar el backdrop y su contenido
            modalContainer.classList.remove('hidden');
        }
    };

    /**
     * Función para ocultar el popup
     */
    const hidePopup = () => {
        if (modalContainer) {
            // Agrega la clase 'hidden' para ocultar el backdrop
            modalContainer.classList.add('hidden');
        }
    };

    // ----------------------------------------------------
    // LÓGICA DE TEMPORIZACIÓN (7 segundos)
    // ----------------------------------------------------

    // Inicia un temporizador para mostrar el popup después de 7000 milisegundos
    setTimeout(showPopup, 7000);

    // ----------------------------------------------------
    // LÓGICA DE CIERRE DEL POPUP
    // ----------------------------------------------------

    // 1. Clic en el botón de cerrar ('X')
    if (closeButton) {
        closeButton.addEventListener('click', hidePopup);
    }

    // 2. Clic en el botón principal ("Entendido")
    if (acceptButton) {
        acceptButton.addEventListener('click', hidePopup);
    }

    // 3. Clic fuera del contenido (en el backdrop)
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            // Si el elemento clicado es el contenedor principal (el backdrop), cerrar
            if (event.target === modalContainer) {
                hidePopup();
            }
        });
    }
});