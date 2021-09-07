import type { Host } from '../../../types';

const saveKey = 'hosts_list';

export const saveHosts = function(hosts: Array<Host>): void {
    if (localStorage) {
        localStorage.setItem(saveKey, JSON.stringify(hosts));
    }
};

export const loadHosts = function(): Array<Host> {
    if (localStorage) {
        const jsonHosts = localStorage.getItem(saveKey);
        if (jsonHosts) {
            const hosts: Array<Host> = JSON.parse(jsonHosts);
            return hosts;
        }
    }
    return [];
};