import { Archive, Category } from './types';
import axios from 'axios';
//const archive = require('../hexacross.json') as Archive;

export default class WebApi {
    static url = 'http://localhost:3030/';
    static async getCategories() {
        let cat = await axios.get(WebApi.url + 'api')
        return cat.data;
    }

    static async getGame(name: string) {
        let cat = await axios.get(WebApi.url + 'api?save_name=' + name)
        return cat.data;
    }

    static tidUrl(tid: string){
        return this.url + 'file?id=' + tid;
    }
}