import type { Host } from 'types';
import type { HostStrUpdate, State } from 'types/vuex';
import { createStore } from 'vuex';
import type { Store } from 'vuex';
import { loadHosts, saveHosts } from './storage-helper';

const saveToStoragePlugin = (store: Store<State>) => {
    store.subscribe((mutation, state) => {
        saveHosts(state.hosts);
    });
};

export default createStore({
    state(): State {
        // TODO: Combine hosts from hosts file and from local storage
        const loadedHosts: Array<Host> = loadHosts();

        return {
            hosts: loadedHosts,
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
        removeHost(state: State, index: number) {
            const i = state.hosts.findIndex(host => host.index === index);
            if (typeof i !== 'undefined') {
                state.hosts.splice(i, 1);
            }
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