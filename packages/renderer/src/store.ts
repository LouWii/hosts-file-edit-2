import type { HostStrUpdate, State } from 'types/vuex';
import { createStore } from 'vuex';
import type { Store } from 'vuex';
import { loadHosts, saveHosts } from './storage-helper';
import type { Host } from '../../../types';
import * as clone from 'clone';

const saveToStoragePlugin = (store: Store<State>) => {
    store.subscribe((mutation, state) => {
        saveHosts(state.hosts);
    });
};

// TODO: Combine hosts from hosts file and from local storage
const initialLoadedHosts = loadHosts();

export default createStore({
    state(): State {
        return {
            hosts: loadHosts(), // TODO: Combine hosts from hosts file and from local storage
            showLoadingOverlay: false,
        };
    },
    plugins: [saveToStoragePlugin],
    mutations: {
        addNewHost(state: State) {
            let maxIndex = 0;
            state.hosts.forEach(host => {
                if (host.index > maxIndex) maxIndex = host.index;
            });
            const host: Host = {
                str: '127.0.0.1    site.local',
                active: true,
                index: maxIndex + 1,
            };
            state.hosts.push(host);
        },
        deleteAllHosts(state: State) {
            state.hosts = [];
        },
        emptyState(state: State) {
            state.showLoadingOverlay = false;
            state.hosts = clone(initialLoadedHosts);
        },
        hideLoadingOverlay(state: State) {
            state.showLoadingOverlay = false;
        },
        removeHost(state: State, index: number) {
            const i = state.hosts.findIndex(host => host.index === index);
            if (typeof i !== 'undefined') {
                state.hosts.splice(i, 1);
            }
        },
        showLoadingOverlay(state: State) {
            state.showLoadingOverlay = true;
        },
        toggleHostActive(state: State, index: number) {
            const host = state.hosts.find(h => h.index === index);
            if (typeof host !== 'undefined') {
                Object.assign(host, {active: !host.active});
            }
        },
        updateHostStr(state: State, payload: HostStrUpdate) {
            const host = state.hosts.find(h => h.index === payload.index);
            if (typeof host !== 'undefined') {
                Object.assign(host, {str: payload.str});
            }
        },
    },
});