
import { gestorDeDatos } from './assets/js/data-loader/productService.js';

const LANGUAGE = gestorDeDatos.language;

window.location.href = `./${LANGUAGE}`;   
