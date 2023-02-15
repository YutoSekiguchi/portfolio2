import { defineStore } from 'pinia'
import Works from '../settings/works.json';
import Products from '../settings/products.json';
import { WorksType } from '@/settings/worksType';
import { ProductsType } from '@/settings/productsType';

export interface TagsState {
  searchTagList: string[];
  works: WorksType[];
  products: ProductsType[];
}

export interface TagsActions {
  getWorks: (tagList: string[]) => void;
  getProducts: (tagList: string[]) => void;
  changeTag: (name: string) => void;
}

const getElements = (tags: string[], items: WorksType[] | ProductsType[]) => {
  const res: any[] = [];
  items.map((item) => {
    tags.map((tag) => {
      if (item.tagList && item.tagList.includes(tag) && !res.includes(item)) { res.push(item); }
    })
  })
  return res;
}

export const useTagsStore = defineStore<string, TagsState, any, TagsActions>({
  id: 'tags',
  state: () => ({
    searchTagList: [],
    works: Works,
    products: Products,
  }),
  actions: {
    getWorks(tags: string[]) {
      this.works = getElements(tags, Works);
    },
    getProducts(tags: string[]) {
      this.products = getElements(tags, Products);
    },
    changeTag(name: string) {
      this.searchTagList = [name];
      this.getWorks(this.searchTagList);
      this.getProducts(this.searchTagList);
    },
  }
})