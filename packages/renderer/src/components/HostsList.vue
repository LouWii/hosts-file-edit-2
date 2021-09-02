<template>
  <div class="hosts-list">
    <host-item :key="index" v-for="(host, index) in hosts" :host="host" />
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
  setup() {
    
    return {};
  },
  props: {
    hosts: {
      required: true,
      type: Array
    }
  },
  methods: {

  }
});
</script>