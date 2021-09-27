import {createApp} from 'vue';
import App from '/@/App.vue';
import store from '/@/store';
import undoRedoPlugin from './undo-redo-plugin';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = createApp(App);
app.use(store);
app.use(undoRedoPlugin, {ignoreMutations: ['hideLoadingOverlay', 'showLoadingOverlay']});
app.mount('#app');