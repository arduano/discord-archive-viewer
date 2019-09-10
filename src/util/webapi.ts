import { Archive, Category } from './types';
const archive = require('../hexacross.json') as Archive;

export default class WebApi {
    static async getCategories() {
        let cat: Category[] = [];
        for (let i = 0; i < 100; i++) cat.push(archive.categories[0]);
        return cat;
    }

    static async getGame() {
        return archive;
    }
}