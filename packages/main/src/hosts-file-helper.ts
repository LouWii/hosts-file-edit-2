import { accessSync, constants, readFile } from 'fs';

//const hostsFilePath = '/etc/hosts';
const hostsDelimiterStart = '# ----- HostsFileEdit config - Do not delete -----';
const hostsDelimiterEnd   = '# -----      HostsFileEdit config - End      -----';
//const regex = /(?:# ----- HostsFileEdit config - Do not delete -----\n)([\s\S]*)(?:# -----      HostsFileEdit config - End      -----\n?)/g;
const hostsFilePaths: Record<string, string> = {
  'linux': '/etc/hosts',
  'darwin': '/etc/hosts',
  'win32': 'C:\\Windows\\System32\\drivers\\etc\\hosts', // TODO: What if Windows is not on C:?
  // Might be able to support others? https://nodejs.org/api/process.html#process_process_platform
};

export const readHostsFile = function(): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = hostsFilePaths[process.platform];
    if (!path) {
      reject(`Platform ${process.platform} not supported`);
    } else {
      try {
        accessSync(path, constants.R_OK);
      } catch (error) {
        reject(`Tried to read file ${path} but file is not readable`);
      }

      readFile(path, 'utf-8', (err, data) => {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
      });
    }
  });
};

export const getEditableHostsFromFile = function(): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    readHostsFile().then((content: string) => {
      const lines: Array<string> = [];
      let appLines = false;
      content.split('\n').forEach((line) => {
        if (line.substr(0, hostsDelimiterStart.length) === hostsDelimiterStart) {
          appLines = true;
        } else if (appLines) {
          if (line.substr(0, hostsDelimiterEnd.length) === hostsDelimiterEnd) {
            appLines = false;
          } else {
            lines.push(line.replace('\r', ''));
          }
        }
      });

      resolve(lines);
    })
    .catch((error: Error) => {
      reject(error);
    });
  });
};