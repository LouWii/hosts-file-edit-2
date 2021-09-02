<template>
  <div class="host-item">
    <div class="input-group">
      <input class="form-control" type="text" v-model="host.str" />
      <span class="input-group-btn">
        <button type="button" class="btn" v-on:click="activateHost" v-bind:class="{'btn-success': host.active, 'btn-default': !host.active}" v-bind:title="host.active ? 'Active' : 'Inactive'" >
          <span class="glyphicon" v-bind:class="{'glyphicon-ok-circle': host.active, 'glyphicon-ban-circle': !host.active}" ></span>
        </button>
        <button type="button" v-on:click="removeHost" class="btn btn-default" title="Delete">
          <span class="glyphicon glyphicon-trash"></span>
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
      type: Object
    },
  },
  methods: {
    activateHost() {

    },
    removeHost() {
      this.$emit('remove-host', )
    },
  },
});
</script>