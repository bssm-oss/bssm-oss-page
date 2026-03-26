declare module '@babel/standalone' {
  interface TransformResult {
    code?: string
  }

  interface TransformOptions {
    filename?: string
    presets?: Array<string | [string, Record<string, unknown>]>
  }

  interface BabelStandalone {
    transform: (code: string, options?: TransformOptions) => TransformResult
  }

  const Babel: BabelStandalone
  export default Babel
}
