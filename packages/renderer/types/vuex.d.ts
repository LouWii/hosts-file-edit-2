import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

export interface State {
    hosts: Array<Host>
}

export interface HostStrUpdate {
    index: number,
    str: string,
}

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $store: Store<State>
    }
}