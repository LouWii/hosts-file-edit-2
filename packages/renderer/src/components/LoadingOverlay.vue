<template>
  <div
    v-if="showLoadingOverlay"
    class="overlay-container"
  >
    <div class="loading-card">
      <div class="icon-container">
        <span class="glyphicon glyphicon-floppy-disk" />
      </div>
      <div class="loading-text">
        Saving data...
      </div>
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
  user-select: none;
  display: flex;
  flex-direction: column;
}
.icon-container {
  overflow: hidden;
  flex: 1;
}
.icon-container .glyphicon {
  font-size: 8rem;
  margin-left: 8px;

  animation-duration: 1.5s;
  animation-name: slidein;
  animation-iteration-count: infinite;
}
.loading-text {
  font-size: 125%;
  margin: 0.3rem 0;
}
@keyframes slidein {
  from {
    transform: translateY(-50px);
    opacity: 1;
  }

  50% {
    transform: translateY(25px);
    opacity: 1;
  }

  65% {
    transform: translateY(25px);
    opacity: 1;
  }

  to {
    opacity: 0;
    transform: translateY(25px);
  }
}
</style>