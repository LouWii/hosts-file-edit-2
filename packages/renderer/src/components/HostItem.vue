<template>
  <div class="host-item">
    <div class="input-group">
      <input
        v-model="localHostStr"
        class="form-control"
        type="text"
      >
      <span class="input-group-btn">
        <button
          type="button"
          class="btn"
          :class="{'btn-success': host.active, 'btn-default': !host.active}"
          :title="host.active ? 'Active' : 'Inactive'"
          @click="activateHost"
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
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'HostItem',
  props: {
    host: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      localHostStr: null,
    };
  },
  beforeMount() {
    this.localHostStr = this.host.str;
  },
  methods: {
    activateHost() {
      this.$emit('activate-host' );
    },
    removeHost() {
      this.$emit('remove-host' );
    },
  },
});
</script>

<style scoped>
.host-item {
  margin-bottom: 1.5rem;
}
</style>