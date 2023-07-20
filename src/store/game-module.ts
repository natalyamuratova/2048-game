import { State } from 'vuex-simple';

class GameModule {
  @State()
  public board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

export default GameModule;
