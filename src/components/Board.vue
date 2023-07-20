<template>
  <h2>Score: {{ score }}</h2>
  <div class="board-container"
       ref="boardRef">
    <template v-for="(row, rowIndex) in board">
      <Cell v-for="(cellValue, columnIndex) in row"
            :key="`${rowIndex}-${columnIndex}`"
            :value="cellValue"
      ></Cell>
    </template>
  </div>
</template>

<script lang="ts">
import {
  onMounted, onUnmounted, ref, watch,
} from 'vue';
import Cell from './Cell.vue';
import useSwipe, { TouchType } from '../composables/useSwipe';

/**
 * Board component.
 */
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Board',
  components: {
    Cell,
  },
  setup() {
    const rows = 4;
    const columns = 4;

    const board = ref([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
    const score = ref(0);

    const hasEmptyCell = () => board.value.find((row) => row.some((cellValue) => (cellValue === 0)))
      !== undefined;

    const getNewValue = () => {
      const degree = Math.ceil(Math.random() * 2);
      return 2 ** degree;
    };

    const setValueInRandomPlace = () => {
      if (!hasEmptyCell()) {
        return;
      }
      let found = false;
      while (!found) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * columns);
        if (board.value[r][c] === 0) {
          board.value[r][c] = getNewValue();
          found = true;
        }
      }
    };

    const filterZero = (row: number[]) => row.filter((num) => num !== 0);

    const slide = (row: number[]) => {
      // [0, 2, 2, 2]
      let filteredRow = filterZero(row); // [2, 2, 2]
      for (let i = 0; i < filteredRow.length - 1; i += 1) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          score.value += filteredRow[i];
        }
      } // [4, 0, 2]
      filteredRow = filterZero(filteredRow); // [4, 2]
      while (filteredRow.length < columns) {
        filteredRow.push(0);
      } // [4, 2, 0, 0]
      return filteredRow;
    };

    const slideLeft = () => {
      for (let r = 0; r < rows; r += 1) {
        let row = board.value[r];
        row = slide(row);
        board.value[r] = row;
      }
    };

    const slideRight = () => {
      for (let r = 0; r < rows; r += 1) {
        let row = board.value[r]; // [0, 2, 2, 2]
        row.reverse(); // [2, 2, 2, 0]
        row = slide(row); // [4, 2, 0, 0]
        board.value[r] = row.reverse(); // [0, 0, 2, 4];
      }
    };

    const slideUp = () => {
      for (let c = 0; c < columns; c += 1) {
        let row = [board.value[0][c], board.value[1][c], board.value[2][c], board.value[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r += 1) {
          board.value[r][c] = row[r];
        }
      }
    };

    const slideDown = () => {
      for (let c = 0; c < columns; c += 1) {
        let row = [board.value[0][c], board.value[1][c], board.value[2][c], board.value[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r += 1) {
          board.value[r][c] = row[r];
        }
      }
    };

    function handleArrowKeyDown(event: KeyboardEvent | TouchType): void {
      if (event === 'left' || (event as KeyboardEvent)?.code === 'ArrowLeft') {
        slideLeft();
        setValueInRandomPlace();
      } else if (event === 'right' || (event as KeyboardEvent)?.code === 'ArrowRight') {
        slideRight();
        setValueInRandomPlace();
      } else if (event === 'up' || (event as KeyboardEvent)?.code === 'ArrowUp') {
        slideUp();
        setValueInRandomPlace();
      } else if (event === 'down' || (event as KeyboardEvent)?.code === 'ArrowDown') {
        slideDown();
        setValueInRandomPlace();
      }
    }

    const initGame = () => {
      setValueInRandomPlace();
      setValueInRandomPlace();

      document.addEventListener('keyup', handleArrowKeyDown);
    };

    const destroyGame = () => {
      document.removeEventListener('keyup', handleArrowKeyDown);
    };

    onMounted(() => {
      initGame();
    });

    onUnmounted(() => {
      destroyGame();
    });

    const boardRef = ref();
    const { touch } = useSwipe(boardRef);
    watch(touch, () => {
      handleArrowKeyDown(touch.value);
    });

    return {
      boardRef,
      board,
      score,
    };
  },
};
</script>

<style lang="scss" scoped>
.board-container {
  width: 400px;
  height: 400px;

  background-color: #cdc1b5;
  border: 6px solid #bbada0;

  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;

  @media (max-width: 400px) {
    width: 280px;
    height: 280px;
  }
}

</style>
