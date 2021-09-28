import { accessSync, constants, readFile } from 'fs';
import * as sudo from 'sudo-prompt';
import type { Host } from '../../../types';

const hostsDelimiterStart = '# ----- HostsFileEdit config - Do not delete -----';
const hostsDelimiterEnd   = '# -----      HostsFileEdit config - End      -----';

const hostsFilePaths: Record<string, string> = {
  'linux': '/etc/hosts',
  'darwin': '/etc/hosts',
  'win32': 'C:\\Windows\\System32\\drivers\\etc\\hosts', // TODO: What if Windows is not on C:?
  // Might be able to support others? https://nodejs.org/api/process.html#process_process_platform
};

// const lineEndings: Record<string, string> = {
//   'linux': '\n',
//   'darwin': '\r',
//   'win32': '\r\n',
// };

const RESULT_STATE_CLEAN = 'clean';
const RESULT_STATE_FOUND = 'found';

const sudoExecOptions = {
  name: 'Electron',
  icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
};

export const getHostsFilePath = function(): string {
  const path = hostsFilePaths[process.platform];
    if (!path) {
      throw `Platform ${process.platform} not supported`;
    }
    return path;
};

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

export const checkFileIntegrity = function(): Promise<string> {
  return new Promise((resolve, reject) => {
    readHostsFile().then((content) => {
      let foundStartTag = false;
      let foundEndTag   = false;
      content.split('\n').forEach((line) => {
        if (line.substr(0, hostsDelimiterStart.length) === hostsDelimiterStart) {
          foundStartTag = true;
        } else if (line.substr(0, hostsDelimiterEnd.length) === hostsDelimiterEnd) {
          if (!foundStartTag) {
            reject('Found end tag before start tag');
            return;
          } else {
            foundEndTag = true;
          }
        }
      });

      if (foundStartTag && !foundEndTag) {
        reject('Missing end tag');
        return;
      }

      if (!foundStartTag && !foundEndTag) {
        resolve(RESULT_STATE_CLEAN);
      } else {
        resolve(RESULT_STATE_FOUND);
      }
    });
  });
};

export const assembleLines = function(hosts: Array<Host>, lineEnding: string, linePrefix = ''): string {
  let lines = '';
  hosts.forEach(host => {
    lines += linePrefix;
    if (!host.active) {
      lines += '# ';
    }
    lines += host.str;
    lines += lineEnding;
  });

  return lines;
};

export const saveToFile = function(serializedHosts: string): Promise<boolean> {
  const hosts = JSON.parse(serializedHosts);
  return new Promise((resolve, reject) => {
    checkFileIntegrity()
      .then((resultState) => {
        // Write the lines
        // So here comes the tricky part - find the easiest-safest-fastest option to write the content in the file
        // What I decided for now:
        // - clean hosts file: add the block at the end of the file
        // - block present: use a regex replace (just because the block might not be at the end of the file anymore)

        let command = '';
        if (RESULT_STATE_CLEAN === resultState) {
          if ('win32' === process.platform) {
            command = `(echo.
echo ${hostsDelimiterStart}
${assembleLines(hosts, '\n', 'echo ')}
echo ${hostsDelimiterEnd}) >> ${getHostsFilePath()}`;
          } else if ('linux' === process.platform) {
            // Using printf as it has a more consistent behavior compared to echo
            command = `printf '${hostsDelimiterStart}\n${assembleLines(hosts, '\n')}${hostsDelimiterEnd}\n' >> ${getHostsFilePath()}`;
          }
        } else {
          if ('win32' === process.platform) {
            const replacement = '\\"`${1}' + assembleLines(hosts, '`r`n') + '`${3}\\"';
            command = `powershell -command "(Get-Content -Raw ${getHostsFilePath()}) | Foreach-Object {$_ -replace '(${hostsDelimiterStart}\\r\\n)([\\s\\S]*)(${hostsDelimiterEnd}\\r\\n)', ${replacement}} | Set-Content ${getHostsFilePath()}`;
          } else if ('linux' === process.platform) {
            // sed is hard to use with new line char in regex and is not consistent between some distros
            // Chose to use perl which hopefully is consistent between all distros
            const replacement = `${hostsDelimiterStart}\\n${assembleLines(hosts, '\\n')}${hostsDelimiterEnd}\\n`;
            command = `perl -i -0pe 's/(${hostsDelimiterStart}\\n)[\\s\\S]*(${hostsDelimiterEnd}\\n)/${replacement}/s' ${getHostsFilePath()}`;
          }
        }

        if (command) {
          // https://github.com/jorangreef/sudo-prompt/issues/1  "bash -c -e \"echo 'some text' > /Library/some-file.txt\""

          sudo.exec(
            command,
            sudoExecOptions,
            function(error?: Error/*, stdout?: string | Buffer, stderr?: string | Buffer*/) {
              if (error) {
                reject(error);
              } else {
                resolve(true);
              }
            },
          );
        } else {
          reject(`Platform ${process.platform} not supported`);
        }
      })
      .catch((errorMessage) => {
        reject(errorMessage);
      });
  });
};