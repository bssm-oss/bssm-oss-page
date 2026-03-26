import type { AiProvider, EditorMode } from '../types'

const storageKeys = {
  actor: 'bssm-live-editor.actor',
  mode: 'bssm-live-editor.mode',
  openAiKey: 'bssm-live-editor.openai-key',
  anthropicKey: 'bssm-live-editor.anthropic-key',
  provider: 'bssm-live-editor.provider',
}

function safeStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  const candidate = window.localStorage
  return candidate &&
    typeof candidate.getItem === 'function' &&
    typeof candidate.setItem === 'function'
    ? candidate
    : null
}

export function getStoredMode(defaultMode: EditorMode = 'ai') {
  const value = safeStorage()?.getItem(storageKeys.mode)
  return value === 'code' ? 'code' : defaultMode
}

export function storeMode(mode: EditorMode) {
  safeStorage()?.setItem(storageKeys.mode, mode)
}

export function getEditorActor() {
  const existing = safeStorage()?.getItem(storageKeys.actor)

  if (existing) {
    return existing
  }

  const generated = `guest-${Math.random().toString(36).slice(2, 7)}`
  safeStorage()?.setItem(storageKeys.actor, generated)

  return generated
}

export function storeEditorActor(actor: string) {
  safeStorage()?.setItem(storageKeys.actor, actor.trim())
}

export function getAiProvider(defaultProvider: AiProvider = 'openai') {
  const value = safeStorage()?.getItem(storageKeys.provider)
  return value === 'anthropic' ? 'anthropic' : defaultProvider
}

export function storeAiProvider(provider: AiProvider) {
  safeStorage()?.setItem(storageKeys.provider, provider)
}

export function getProviderApiKey(provider: AiProvider) {
  if (provider === 'anthropic') {
    return safeStorage()?.getItem(storageKeys.anthropicKey) ?? ''
  }

  return safeStorage()?.getItem(storageKeys.openAiKey) ?? ''
}

export function storeProviderApiKey(provider: AiProvider, value: string) {
  safeStorage()?.setItem(
    provider === 'anthropic' ? storageKeys.anthropicKey : storageKeys.openAiKey,
    value.trim(),
  )
}

export async function verifyEditPassphrase(input: string) {
  const expectedHash = import.meta.env.VITE_EDITOR_PASSPHRASE_SHA256

  if (!expectedHash) {
    return true
  }

  if (!globalThis.crypto?.subtle) {
    return false
  }

  const encoded = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', encoded)
  const value = Array.from(new Uint8Array(digest))
    .map((chunk) => chunk.toString(16).padStart(2, '0'))
    .join('')

  return value === expectedHash.toLowerCase()
}
