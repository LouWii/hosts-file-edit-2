<template>
  <header>Hosts File Edit</header>
  <div class="actions">
    <button @click="addHost">Add</button>
  </div>
  <hosts-list :hosts="hosts" />
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import HostsList from '/@/components/HostsList.vue';
import {getHosts} from '/@/hosts-helper';

export default defineComponent({
  name: 'App',
  components: {
    HostsList,
  },
  data() {
    return {
      hosts: getHosts()
    }
  },
  methods: {
    addHost() {
      this.hosts.push({str: '', active: true})
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
