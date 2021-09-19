<template>
  <div
    v-if="showLoadingOverlay"
    class="overlay-container"
  >
    <div class="loading-card">
      Loading
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
  name: 'LoadingOverlay',
  computed: {
    ...mapState(['showLoadingOverlay']),
  },
});
</script>

<style scoped>
.overlay-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 2rem;
  background: rgb(0 0 0 / 27%);
}
.loading-card {
  height: 150px;
  width: 150px;
  margin: auto;
  background: #fff;
  border-radius: 1rem;
}
</style>