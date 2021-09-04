<template>
  <div class="actions-container">
    <button
      class="btn btn-default"
      @click="addHost"
    >
      Add
    </button>
    <div class="btn-group">
      <button
        class="btn btn-primary btn-save-hosts"
        :disabled="saveIntoFileButtonDisabled"
        :class="saveIntoFileButtonClass"
        @click="saveHostsFile"
      >
        <span class="glyphicon" /> 
        <span class="text-state text">Save to <em>hosts</em> file</span>
        <span class="text-state text-saving">Saving...</span>
        <span class="text-state text-saved">Saved !</span>
        <span class="text-state text-error">Error</span>
      </button>
      <button
        type="button"
        class="btn btn-primary dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <span class="caret" />
        <span class="sr-only">Toggle Dropdown</span>
      </button>
      <ul class="dropdown-menu">
        <li>
          <a
            href="#"
            @click="importHostsList"
          >Import settings</a>
        </li>
        <li>
          <a
            href="#"
            @click="exportHostsList"
          >Export settings</a>
        </li>
      </ul>
    </div>
  </div>
  <main>
    <hosts-list :hosts="hosts" />
  </main>
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
      hosts: getHosts(),
      savingIntoFile: false,
      savingIntoFileState: 0,
    };
  },
  computed: {
    saveIntoFileButtonClass() {
      return {
        saving: this.savingIntoFile,
        saved: this.savingIntoFileState == 1,
        error: this.savingIntoFileState == -1,
      };
    },
    saveIntoFileButtonDisabled() {
      return this.savingIntoFile || this.savingIntoFileState != 0;
    },
  },
  methods: {
    addHost() {
      this.hosts.push({str: '', active: true});
    },
    saveHostsFile() {
      let mm = 'tt';
      mm.charAt(4);
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

main {
  overflow: auto;
  padding: 2rem;
}


.btn-save-hosts .text-saving, .btn-save-hosts .text-saved, .btn-save-hosts .text-error {
  display: none;
}
.btn-save-hosts .glyphicon::before {
  content: "\e202";
}

.btn-save-hosts.saving:hover {
  background: #337ab7;
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
.btn-save-hosts.saving .text, .btn-save-hosts.saving .text-saved {
  display: none;
}
.btn-save-hosts.saving .text-saving {
  display: inline;
}

.btn-save-hosts.saved .glyphicon::before {
  content: "\e013";
}
.btn-save-hosts.saved .text {
  display: none;
}
.btn-save-hosts.saved .text-saved {
  display: inline;
}

.btn-save-hosts.error .glyphicon::before {
  content: "\e101";
}
.btn-save-hosts.error .text {
  display: none;
}
.btn-save-hosts.error .text-error {
  display: inline;
}

@keyframes spin {
    from {transform:rotate(0deg);}
    to {transform:rotate(360deg);}
}
</style>
