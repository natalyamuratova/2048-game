<template>
  <h1>2048</h1>
  <hr>
  <Board/>
</template>

<script lang="ts">
import Board from '@/components/Board.vue';

export default {
  name: 'App',
  components: {
    Board,
  },
};
</script>

<style lang="scss">
body {
  margin: 0;
}

#app {
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}

hr {
  width: 500px;

  @media (max-width: 400px) {
    width: auto;
  }
}
</style>
