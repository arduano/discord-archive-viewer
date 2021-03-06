import { Archive, Category } from './types';
import axios from 'axios';
import config from '../config';

export default class WebApi {
    static url = config.url;
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