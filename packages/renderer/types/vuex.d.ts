// import type { ComponentCustomProperties } from 'vue';
import type { Store } from 'vuex';

export interface State {
    hosts: Array<Host>
    showLoadingOverlay: boolean
}

export interface HostStrUpdate {
    index: number
    str: string
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}

export interface Mutation {
    type: string
    payload?: any
}