const categories = require('./categories.json');
const products = require('./products.json');
const users = require('./users.json');
const orders = require('./orders.json');

module.exports = () => ({
    categories: categories.categories,
    products: products.products,
    users: users.users,
    orders: orders.orders
});
