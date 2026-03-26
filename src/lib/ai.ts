import type { AiProvider, AiResult, CommentThread, EditableNode } from '../types'

export interface AiCompletionRequest {
  provider: AiProvider
  apiKey: string
  model: string
  node: EditableNode
  thread: CommentThread | null
  prompt: string
}

function systemPrompt() {
  return [
    'You are editing one React runtime node for a live collaborative website editor.',
    'Return JSON only.',
    'The JSON shape must be: {"summary": string, "nextSource": string, "notes": string[]}.',
    'The nextSource must be a single JSX expression, not a full file.',
    'Only edit the selected node.',
    'Do not import modules or reference browser globals.',
    'Keep the result renderable inside a React app using component props that already exist on the node.',
  ].join(' ')
}

function extractJsonBlock(text: string) {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim()
  }

  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')

  if (start >= 0 && end > start) {
    return text.slice(start, end + 1)
  }

  return text.trim()
}

function parseAiResult(rawText: string): AiResult {
  const parsed = JSON.parse(extractJsonBlock(rawText)) as Partial<AiResult>

  if (
    typeof parsed.summary !== 'string' ||
    typeof parsed.nextSource !== 'string' ||
    !Array.isArray(parsed.notes)
  ) {
    throw new Error('AI response did not match the expected JSON shape.')
  }

  return {
    summary: parsed.summary,
    nextSource: parsed.nextSource,
    notes: parsed.notes.map((item) => String(item)),
  }
}

function buildUserPrompt({
  node,
  prompt,
  thread,
}: Pick<AiCompletionRequest, 'node' | 'prompt' | 'thread'>) {
  return JSON.stringify(
    {
      instruction: prompt,
      selectedNode: {
        nodeId: node.nodeId,
        title: node.title,
        kind: node.kind,
        bindings: node.bindings,
        props: node.props,
        currentSource: node.source,
      },
      thread: thread
        ? {
            threadId: thread.threadId,
            title: thread.title,
            messages: thread.messages.map((message) => ({
              role: message.role,
              text: message.text,
              author: message.author,
            })),
          }
        : null,
    },
    null,
    2,
  )
}

async function invokeOpenAi(request: AiCompletionRequest) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${request.apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      input: [
        {
          role: 'developer',
          content: [{ type: 'input_text', text: systemPrompt() }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: buildUserPrompt(request) }],
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI request failed with ${response.status}`)
  }

  const payload = (await response.json()) as {
    output_text?: string
    output?: Array<{
      content?: Array<{ text?: string }>
    }>
  }

  const rawText =
    payload.output_text ??
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .map((item) => item.text ?? '')
      .join('\n') ??
    ''

  return parseAiResult(rawText)
}

async function invokeAnthropic(request: AiCompletionRequest) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': request.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: request.model,
      max_tokens: 1200,
      system: systemPrompt(),
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(request),
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic request failed with ${response.status}`)
  }

  const payload = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>
  }

  const rawText = payload.content
    ?.filter((item) => item.type === 'text')
    .map((item) => item.text ?? '')
    .join('\n')

  return parseAiResult(rawText ?? '')
}

export async function requestAiCompletion(request: AiCompletionRequest) {
  if (!request.apiKey) {
    throw new Error('Missing API key for the selected provider.')
  }

  if (request.provider === 'anthropic') {
    return invokeAnthropic(request)
  }

  return invokeOpenAi(request)
}

