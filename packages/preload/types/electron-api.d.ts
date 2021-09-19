interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  readonly platform: Readonly<string>
}

declare function saveToHosts(string): Promise<boolean>;

interface FileHelper {
  readonly readFile: () => Promise<string>
  readonly getHostsLines: () => Promise<string>
  saveToHosts
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
  fileHelper: FileHelper
}
