import { defineStore } from 'pinia'

export interface WorksState {
  searchTagList: string[];
}

export interface WorksActions {
  changeTag: (name: string) => void;
}

export const useWorksStore = defineStore<string, WorksState, any, WorksActions>({
  id: 'works',
  state: () => ({
    searchTagList: [],
  }),
  actions: {
    changeTag(name: string) {
      this.searchTagList = [name];
    },
  }
})