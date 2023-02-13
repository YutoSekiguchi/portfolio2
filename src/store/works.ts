import { defineStore } from 'pinia'
import Works from '../settings/works.json';
import { WorksType } from '@/settings/worksType';

export interface WorksState {
  searchTagList: string[];
  works: WorksType[];
}

export interface WorksActions {
  getWorks: (tagList: string[]) => void;
  changeTag: (name: string) => void;
}

export const useWorksStore = defineStore<string, WorksState, any, WorksActions>({
  id: 'works',
  state: () => ({
    searchTagList: [],
    works: Works
  }),
  actions: {
    getWorks(tags: string[]) {
      const res: WorksType[] = [];
      Works.map((work) => {
        tags.map((tag) => {
          if (work.tagList.includes(tag) && !res.includes(work)) { res.push(work); }
        })
      })
      this.works = res;
    },
    changeTag(name: string) {
      this.searchTagList = [name];
      this.getWorks(this.searchTagList);
    },
  }
})