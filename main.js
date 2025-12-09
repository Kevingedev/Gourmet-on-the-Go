
import { gestorDeDatos } from './assets/js/data-loader/productService.js';

const LANGUAGE = gestorDeDatos.language;

if (LANGUAGE !== 'ES' || LANGUAGE !== 'EN') {
    window.location.href = './ES';
}else{
 window.location.href = `./${LANGUAGE}`;   
}