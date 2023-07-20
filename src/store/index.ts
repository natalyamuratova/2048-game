import Vuex from 'vuex';
import { createVuexStore, Module } from 'vuex-simple';
import GameModule from '@/store/game-module';

export class RootModule {
  @Module()
  public gameModule = new GameModule();
}

export const StoreRootModule = new RootModule();
export const simpleStore = createVuexStore(StoreRootModule, {
  modules: {},
});

export default new Vuex.Store(simpleStore);
