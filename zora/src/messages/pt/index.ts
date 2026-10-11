import core from './core.json';
import cart from './cart.json';
import product from './product.json';
import home from './home.json';
import shop from './shop.json';

/** Cada arquivo é um conjunto de namespaces. Para adicionar um grupo de textos: crie o JSON e inclua aqui. */
const messages = { ...core, ...shop, ...home, ...product, ...cart };
export default messages;
