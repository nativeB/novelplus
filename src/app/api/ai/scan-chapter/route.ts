import Anthropic from '@anthropic-ai/sdk'
import type { ExtractedEntry } from '@/types'

const client = new Anthropic()

const VALID_TYPES = new Set(['character', 'location', 'term', 'faction'])

interface ScanRequest {
  chapterText: string
  chapterTitle: string
  existingEntries: { name: string; aliases: string[] }[]
}

function buildPrompt(req: ScanRequest): string {
  const knownNames = req.existingEntries
    .flatMap((e) => [e.name, ...e.aliases])
    .map((n) => `"${n}"`)
    .join(', ')

  return `You are analyzing a chapter from a novel to identify new named entities the author should track in their world bible.

Chapter title: ${req.chapterTitle}

Already tracked in the world bible (DO NOT include these): ${knownNames || 'none yet'}

Read the chapter below and extract ONLY named entities that are NOT already tracked. Focus on:
- character: named persons, creatures, or sentient beings
- location: named places, regions, buildings, or realms
- term: coined words, magic systems, technologies, or in-world concepts needing definition
- faction: named groups, organizations, armies, religions, or political bodies

Rules:
1. Skip anything already in the "already tracked" list above (including aliases).
2. Only extract clearly named entities — skip "the guard", "a village", etc.
3. Descriptions must be based solely on what this chapter reveals. 1–2 sentences max.
4. If no new entities are found, return {"entries":[]}.
5. Return ONLY valid JSON — no markdown, no commentary.

Required format:
{"entries":[{"type":"character","name":"...","aliases":["..."],"description":"..."}]}

CHAPTER TEXT:
${req.chapterText}`
}

export async function POST(req: Request) {
  try {
    const body: ScanRequest = await req.json()

    if (!body.chapterText?.trim()) {
      return Response.json({ error: 'Chapter text is empty.' }, { status: 400 })
    }
    if (body.chapterText.length > 30000) {
      return Response.json({ error: 'Chapter too long to scan (max 30,000 characters).' }, { status: 400 })
    }

    const model = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6'

    const message = await client.messages.create({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    let parsed: { entries: ExtractedEntry[] }
    try {
      parsed = JSON.parse(raw)
    } catch {
      return Response.json({ error: 'AI returned invalid JSON. Try again.' }, { status: 500 })
    }

    if (!Array.isArray(parsed?.entries)) {
      return Response.json({ error: 'Unexpected AI response shape.' }, { status: 500 })
    }

    const entries: ExtractedEntry[] = parsed.entries
      .filter(
        (e) =>
          e &&
          typeof e.name === 'string' &&
          e.name.trim() &&
          VALID_TYPES.has(e.type) &&
          typeof e.description === 'string'
      )
      .map((e) => ({
        type: e.type,
        name: e.name.trim(),
        aliases: Array.isArray(e.aliases)
          ? e.aliases.filter((a) => typeof a === 'string' && a.trim())
          : [],
        description: e.description.trim(),
      }))

    return Response.json({ entries })
  } catch {
    return Response.json({ error: 'AI request failed.' }, { status: 500 })
  }
}
