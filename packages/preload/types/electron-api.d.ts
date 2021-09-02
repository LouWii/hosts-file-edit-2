
interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  readonly platform: Readonly<String>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
