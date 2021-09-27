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

interface AppMenu {
  readonly onMenuNav(cb: ((customData: string) => void)): void;
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
  fileHelper: FileHelper
  appMenu: AppMenu
}
