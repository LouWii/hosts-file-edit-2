<template>
  
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import HostsList from '/@/components/HostsList.vue';

export default defineComponent({
  name: 'Home',
  components: {
    HostsList
  },
  setup() {
    const count = ref(0);

    return {count};
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}
</style>
