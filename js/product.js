import { PRODUCTS, CATEGORIES } from './data.js';

export const ProductModule = {
    products: PRODUCTS,
    categories: CATEGORIES,

    init() {
        console.log('Product knowledge loaded from memory:', this.products.length);
        // No fetch needed to ensure local file compatibility
    },

    getById(id) {
        return this.products.find(p => p.id === id);
    },

    filter(category = 'all', query = '') {
        let list = category === 'all' ? this.products : this.products.filter(p => p.category === category);
        if (query) {
            const q = query.toLowerCase();
            list = list.filter(p =>
                p.name_zh.toLowerCase().includes(q) ||
                p.name_en.toLowerCase().includes(q) ||
                p.style_tags.some(t => t.toLowerCase().includes(q))
            );
        }
        return list;
    }
};
