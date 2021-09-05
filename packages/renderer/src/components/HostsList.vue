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
import { mapState } from 'vuex';
import HostItem from '/@/components/HostItem.vue';

export default defineComponent({
  name: 'HostsList',
  components: {
    HostItem,
  },
  computed: {
    ...mapState(['hosts']),
  },
  methods: {

  },
});
</script>

<style scoped>
</style>