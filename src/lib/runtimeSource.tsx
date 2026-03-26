import * as React from 'react'
import Babel from '@babel/standalone'
import { runtimeComponents } from '../components/workspace/runtimeScope'

type RenderFn = (props: Record<string, unknown>) => React.ReactNode

interface CompileSuccess {
  ok: true
  render: RenderFn
}

interface CompileFailure {
  ok: false
  error: string
}

export type CompileRuntimeResult = CompileSuccess | CompileFailure

const compileCache = new Map<string, CompileRuntimeResult>()

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unknown runtime error'
}

function createFactorySource(source: string, propKeys: string[]) {
  const destructure =
    propKeys.length > 0 ? `const { ${propKeys.join(', ')} } = props;` : ''

  return `
    const __output = (() => {
      const __Node = (props) => {
        ${destructure}
        return (${source});
      };
      return __Node;
    })();
  `
}

export function compileRuntimeSource(
  source: string,
  propKeys: string[],
): CompileRuntimeResult {
  const cacheKey = `${source}__${[...propKeys].sort().join(',')}`
  const cached = compileCache.get(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const transpiled = Babel.transform(createFactorySource(source, propKeys), {
      filename: 'runtime-node.tsx',
      presets: [['react', { runtime: 'classic' }], 'typescript'],
    }).code

    if (!transpiled) {
      throw new Error('No compiled output from Babel')
    }

    const scopeEntries = Object.entries(runtimeComponents)
    const scopeKeys = scopeEntries.map(([key]) => key)
    const scopeValues = scopeEntries.map(([, value]) => value)
    const factory = new Function('React', ...scopeKeys, `${transpiled}\nreturn __output;`)
    const compiled = factory(React, ...scopeValues) as RenderFn

    const result: CompileSuccess = {
      ok: true,
      render: compiled,
    }

    compileCache.set(cacheKey, result)

    return result
  } catch (error) {
    const result: CompileFailure = {
      ok: false,
      error: normalizeError(error),
    }

    compileCache.set(cacheKey, result)

    return result
  }
}

export function validateRuntimeSource(source: string, props: Record<string, unknown>) {
  const compiled = compileRuntimeSource(source, Object.keys(props))

  if (!compiled.ok) {
    return compiled
  }

  try {
    const rendered = compiled.render(props)
    const isRenderable =
      rendered === null ||
      rendered === undefined ||
      typeof rendered === 'string' ||
      typeof rendered === 'number' ||
      React.isValidElement(rendered) ||
      Array.isArray(rendered)

    if (!isRenderable) {
      return {
        ok: false,
        error: 'The runtime source did not produce a renderable React node.',
      } satisfies CompileFailure
    }

    return compiled
  } catch (error) {
    return {
      ok: false,
      error: normalizeError(error),
    } satisfies CompileFailure
  }
}
