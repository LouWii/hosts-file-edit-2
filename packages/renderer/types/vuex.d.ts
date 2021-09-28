export interface State {
    hosts: Array<Host>
    showLoadingOverlay: boolean
}

export interface HostStrUpdate {
    index: number
    str: string
}

export interface Mutation {
    type: string
    payload?: unknown
}