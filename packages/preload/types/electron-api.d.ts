
interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  readonly platform: Readonly<string>
}

interface FileHelper {
  readonly readFile: () => Promise<string>
  readonly getHostsLines: () => Promise<string>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
  fileHelper: FileHelper
}
