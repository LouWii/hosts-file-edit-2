<template>
  <div class="hosts-list">
    <host-item
      v-for="(host, index) in hosts"
      :key="index"
      :host="host"
    />
  </div>
</template>

<script lang="ts">
import type { Host } from 'types';
import type { PropType} from 'vue';
import {defineComponent} from 'vue';
import HostItem from '/@/components/HostItem.vue';

export default defineComponent({
  name: 'HostsList',
  components: {
    HostItem,
  },
  props: {
    hosts: {
      required: true,
      type: Array as PropType<Array<Host>>,
    },
  },
  setup() {
    
    return {};
  },
  methods: {

  },
});
</script>

<style scoped>
</style>