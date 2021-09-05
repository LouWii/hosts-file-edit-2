<template>
  <div class="actions-container">
    <button
      class="btn btn-default"
      title="Add new line"
      @click="addHost"
    >
      <span class="glyphicon glyphicon-plus" />
    </button>
    <button
      class="btn btn-primary btn-save-hosts"
      title="Save to hosts file"
      :disabled="saveIntoFileButtonDisabled"
      :class="saveIntoFileButtonClass"
      @click="saveHostsFile"
    >
      <span class="glyphicon glyphicon-floppy-disk" />
    </button>
  </div>
  <main>
    <hosts-list />
  </main>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import HostsList from '/@/components/HostsList.vue';

export default defineComponent({
  name: 'App',
  components: {
    HostsList,
  },
  data() {
    return {
      savingIntoFile: false,
      savingIntoFileState: 0,
    };
  },
  computed: {
    saveIntoFileButtonClass(): Record<string, boolean> {
      return {
        saving: this.savingIntoFile,
        saved: this.savingIntoFileState == 1,
        error: this.savingIntoFileState == -1,
      };
    },
    saveIntoFileButtonDisabled(): boolean {
      return this.savingIntoFile || this.savingIntoFileState != 0;
    },
  },
  methods: {
    addHost() {
      this.$store.commit('addNewHost');
    },
    saveHostsFile() {
      const p = window.fileHelper.readFile();
      p.then((result: string) => {
        console.log(result);
      }).catch((error: Error) => {
        console.log('something was wrong', error);
      });
    },
    importHostsList() {
      let mm = 'tt';
      mm.charAt(4);
    },
    exportHostsList() {
      let mm = 'tt';
      mm.charAt(4);
    },
  },
});
</script>

<style>
html, 
body {
    max-height: 100vh;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.actions-container {
  text-align: right;
  padding: 1rem;
  box-shadow: -1px 1px 16px 0px rgb(0 0 0 / 45%);
  z-index: 10;
}

.actions-container button {
  margin-left: 1rem;
}

main {
  overflow: auto;
  padding: 2rem;
}

.btn-save-hosts.saving .glyphicon {
  animation-name: spin;
  animation-duration: 2000ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.btn-save-hosts.saving .glyphicon::before {
  content: "\e019";
}

@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
</style>
