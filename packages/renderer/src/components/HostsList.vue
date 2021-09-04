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
      type: Array,
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
.hosts-list {
  
}
</style>