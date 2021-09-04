import type {Host} from '../types';

//const hostsFilePath = '/etc/hosts';
//const hostsDelimiterStart = '# ----- HostsFileEdit config - Do not delete -----';
//const hostsDelimiterEnd   = '# -----      HostsFileEdit config - End      -----';
//const regex = /(?:# ----- HostsFileEdit config - Do not delete -----\n)([\s\S]*)(?:# -----      HostsFileEdit config - End      -----\n?)/g;


export const getHosts = function(): Array<Host> {
    return [
        {str: 'hh', active: true, index: 1},
    ];
};