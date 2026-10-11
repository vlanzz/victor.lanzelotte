import core from './core.json';
import home from './home.json';
import shop from './shop.json';

/** Cada arquivo é um conjunto de namespaces. Para adicionar um grupo de textos: crie o JSON e inclua aqui. */
const messages = { ...core, ...shop, ...home };
export default messages;
