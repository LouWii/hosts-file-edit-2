// Shamelessly taken from https://vuejsdevelopers.com/2017/11/13/vue-js-vuex-undo-redo/
// Didn't find any undo-redo lib that I deemed trustable on the long term

import type { Mutation } from 'types/vuex';
import type { App } from 'vue';

const EMPTY_STATE = 'emptyState';

interface UndoRedoOptions {
  ignoreMutations?: string[]
}

export default {
  install: (app: App, options: UndoRedoOptions = {}): void => {
    app.mixin({
      data() {
        return {
          done: [],
          undone: [],
          newMutation: true,
          ignoreMutations: options.ignoreMutations|| [],
        };
      },
      created() {
        this.$store.subscribe((mutation: Mutation) => {
          if (EMPTY_STATE !== mutation.type && !this.ignoreMutations.includes(mutation.type)) {
            this.done.push(mutation);
          }
          if (this.newMutation) {
            this.undone = [];
          }
        });
      },
      methods: {
        undo() {
          this.undone.push(this.done.pop());
          this.newMutation = false;
          this.$store.commit(EMPTY_STATE);
          this.done.forEach((mutation: Mutation) => {
            switch (typeof mutation.payload) {
              case 'object':
                this.$store.commit(`${mutation.type}`, Object.assign({}, mutation.payload));
                break;
              default:
                this.$store.commit(`${mutation.type}`, mutation.payload);
            }
            this.done.pop();
          });
          this.newMutation = true;
        },
        redo() {
          const commit = this.undone.pop();
          this.newMutation = false;
          switch (typeof commit.payload) {
            case 'object':
              this.$store.commit(`${commit.type}`, Object.assign({}, commit.payload));
              break;
            default:
              this.$store.commit(`${commit.type}`, commit.payload);
          }
          this.newMutation = true;
        },
      },
    });
  },
};