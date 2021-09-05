
interface ElectronApi {
  readonly versions: Readonly<NodeJS.ProcessVersions>
  readonly platform: Readonly<string>
}

declare interface Window {
  electron: Readonly<ElectronApi>
  electronRequire?: NodeRequire
}
