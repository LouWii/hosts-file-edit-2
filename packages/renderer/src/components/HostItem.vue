<template>
  <div class="host-item">
    <div class="input-group">
      <input
        v-model="localHostStr"
        class="form-control"
        type="text"
        @change="updateHostStr"
      >
      <span class="input-group-btn">
        <button
          type="button"
          class="btn"
          :class="{'btn-success': host.active, 'btn-default': !host.active}"
          :title="host.active ? 'Active' : 'Inactive'"
          @click="activateHostToggle"
        >
          <span
            class="glyphicon"
            :class="{'glyphicon-ok-circle': host.active, 'glyphicon-ban-circle': !host.active}"
          />
        </button>
        <button
          type="button"
          class="btn btn-default"
          title="Delete"
          @click="removeHost"
        >
          <span class="glyphicon glyphicon-trash" />
        </button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType} from 'vue';
import {defineComponent} from 'vue';
import type { Host } from '../../../../types';

export default defineComponent({
  name: 'HostItem',
  props: {
    host: {
      required: true,
      type: Object as PropType<Host>,
    },
  },
  data() {
    return {
      localHostStr: '',
      updateDebounce: null as unknown as NodeJS.Timeout,
    };
  },
  watch: {
    localHostStr() {
      clearTimeout(this.updateDebounce);
      this.updateDebounce = setTimeout(() => {
        this.$store.commit('updateHostStr', {index: this.host.index, str: this.localHostStr});
      }, 200);
    },
  },
  beforeMount(): void {
    this.localHostStr = this.host.str;
  },
  methods: {
    activateHostToggle() {
      this.$store.commit('toggleHostActive', this.host.index);
    },
    removeHost() {
      this.$store.commit('removeHost', this.host.index);
    },
    updateHostStr() {
      this.$store.commit('updateHostStr', {index: this.host.index, str: this.localHostStr});
    },
  },
});
</script>

<style scoped>
.host-item {
  margin-bottom: 1.5rem;
}
</style>