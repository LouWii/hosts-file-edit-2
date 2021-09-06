import { accessSync, constants, readFile } from 'fs';
import sudo from 'sudo-prompt';

//const hostsFilePath = '/etc/hosts';
const hostsDelimiterStart = '# ----- HostsFileEdit config - Do not delete -----';
const hostsDelimiterEnd   = '# -----      HostsFileEdit config - End      -----';
//const regex = /(?:# ----- HostsFileEdit config - Do not delete -----\n)([\s\S]*)(?:# -----      HostsFileEdit config - End      -----\n?)/g;
const hostsFilePaths: Record<string, string> = {
  'linux': '/etc/hosts',
  'darwin': '/etc/hosts',
  'win32': 'C:\\Windows\\System32\\drivers\\etc\\testhosts', // TODO: What if Windows is not on C:?
  // Might be able to support others? https://nodejs.org/api/process.html#process_process_platform
};

const lineEndings: Record<string, string> = {
  'linux': '\n',
  'darwin': '\r',
  'win32': '\r\n',
};

export const getHostsFilePath = function(): string {
  const path = hostsFilePaths[process.platform];
    if (!path) {
      throw `Platform ${process.platform} not supported`;
    }
    return path;
}

export const readHostsFile = function(): Promise<string> {
  return new Promise((resolve, reject) => {
    const path = getHostsFilePath();
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
            lines.push(line.replaceAll('\r', '').replaceAll('\n', ''));
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

export const saveToFile = function(newLines: Array<string>): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (0 === newLines.length) {
      resolve(true);
    } else {
      readHostsFile().then((content) => {
        // Got the file content, remove old hosts-file-edit lines
        const keepingLines: Array<string> = [];
        let appLines = false;
        content.split('\n').forEach((line) => {
          if (line.substr(0, hostsDelimiterStart.length) === hostsDelimiterStart) {
            appLines = true;
          } else if (appLines) {
            if (line.substr(0, hostsDelimiterEnd.length) === hostsDelimiterEnd) {
              appLines = false;
            }
          } else if (!appLines) {
            keepingLines.push(line);
          }
        });

        // Append new lines
        // TODO: line endings depending on plat
        keepingLines.push(hostsDelimiterStart + lineEndings[process.platform]);

        keepingLines.push(hostsDelimiterEnd + lineEndings[process.platform]);

        const options = {
          name: 'Electron',
          icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
        };

        // https://github.com/jorangreef/sudo-prompt/issues/1  "bash -c -e \"echo 'some text' > /Library/some-file.txt\""

        sudo.exec(
          `echo "test" > ${getHostsFilePath()}`,
          options,
          function(error, stdout, stderr) {
            if (error) throw error;
            console.log('stdout: ' + stdout);
          }
        );
      })
      .catch((error) => {
        reject(error);
      });
    }
  });
}