document.addEventListener('DOMContentLoaded', () => {

    const footer = document.getElementById('footer');
    const footerContent = `
    <div class="site-footer">
        <div class="footer-inner">
            <!-- Columna 1: Branding y contacto -->
            <div class="footer-col">
                <div class="logo-and-text">
                    <img src="../../assets/img/gourmet-logo-icon.png" alt="Logo" width="35">
                    <h3 class="footer-logo">Gourmet on the Go</h3>
                </div>
                <p class="footer-text">
                    Tienda online de productos gourmet y alimentación al mejor precio.
                </p>
                <ul class="footer-contact">
                    <li><span>Teléfono:</span> +34 600 000 000</li>
                    <li><span>Email:</span> info@gourmetonthego.com</li>
                    <li><span>Horario:</span> L–V 9:00–19:00</li>
                </ul>
                <div class="footer-social">
                    <a href="#" aria-label="Facebook" class="footer-social-link">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#" aria-label="Tiktok" class="footer-social-link">
                        <!-- <i class="fa-brands fa-x-twitter"></i> -->
                        <!-- <i class="fa-brands fa-x-twitter"></i> -->
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                    <a href="#" aria-label="Instagram" class="footer-social-link">
                        <i class="fa-brands fa-instagram"></i>
                    </a>
                </div>
            </div>

            <!-- Columna 2: enlaces legales / info -->
            <div class="footer-col">
                <h4 class="footer-heading">Información</h4>
                <ul class="footer-links">
                    <li><a href="#">Contacto</a></li>
                    <li><a href="#">Quiénes Somos</a></li>
                    <li><a href="#">Aviso Legal</a></li>
                    <li><a href="#">Política de privacidad</a></li>
                    <li><a href="#">Política de Cookies</a>
                    </li>
                    <li><a href="#">Pago</a></li>
                    <li><a href="#">Envío</a></li>
                    <li><a href="#">Condiciones de uso</a>
                    </li>
                </ul>
            </div>

            <!-- Columna 3: newsletter / extra -->
            <div class="footer-col">
                <h4 class="footer-heading">Mantente al día</h4>
                <p class="footer-text">
                    Recibe ofertas exclusivas y novedades en tu correo.
                </p>
                <form class="footer-newsletter">
                    <input type="email" class="footer-input" placeholder="Tu correo electrónico"
                        aria-label="Correo electrónico">
                    <button type="submit" class="footer-btn">
                        Suscribirme
                    </button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <p class="footer-copy">
                &copy; 2025 Gourmet on the Go. Todos los derechos reservados.
            </p>
        </div>
    </div>
    `;
    footer.innerHTML = footerContent;
})