'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBibleStore } from '@/store/useBibleStore'
import { putBibleEntries } from '@/lib/db/bible'
import { generateId } from '@/lib/utils'
import type { BibleEntry, CandidateEntry, ExtractedEntry } from '@/types'
import { ENTRY_TYPE_ORDER, ENTRY_TYPE_COLORS } from '@/lib/bible-constants'

interface Props {
  open: boolean
  onClose: () => void
  chapterId: string
  chapterTitle: string
  chapterContent: string
  novelId: string
}

type Phase = 'idle' | 'loading' | 'review' | 'empty'


export default function ChapterScanPanel({
  open,
  onClose,
  chapterId,
  chapterTitle,
  chapterContent,
  novelId,
}: Props) {
  const { entries, addEntry } = useBibleStore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [candidates, setCandidates] = useState<CandidateEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  async function handleScan() {
    if (!chapterContent.trim()) {
      setError('Chapter is empty — write something first.')
      return
    }
    setPhase('loading')
    setError(null)

    try {
      const res = await fetch('/api/ai/scan-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterText: chapterContent,
          chapterTitle,
          existingEntries: entries.map((e) => ({ name: e.name, aliases: e.aliases })),
        }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Request failed.')

      if (data.entries.length === 0) {
        setPhase('empty')
        return
      }

      const mapped: CandidateEntry[] = (data.entries as ExtractedEntry[]).map((e) => ({
        ...e,
        _key: generateId(),
        accepted: true,
        isDuplicate: false, // already filtered server-side
      }))

      setCandidates(mapped)
      setPhase('review')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setPhase('idle')
    }
  }

  function handleChange(key: string, patch: Partial<CandidateEntry>) {
    setCandidates((prev) => prev.map((c) => (c._key === key ? { ...c, ...patch } : c)))
  }

  async function handleAccept() {
    const accepted = candidates.filter((c) => c.accepted)
    const newEntries: BibleEntry[] = accepted.map((c) => ({
      id: generateId(),
      novelId,
      type: c.type,
      name: c.name.trim(),
      aliases: c.aliases,
      description: c.description.trim(),
      firstIntroducedChapterId: chapterId, // key difference from ExtractModal
    }))

    await putBibleEntries(newEntries)
    newEntries.forEach((e) => addEntry(e))
    handleClose()
  }

  function handleClose() {
    setPhase('idle')
    setCandidates([])
    setError(null)
    onClose()
  }

  const acceptedCount = candidates.filter((c) => c.accepted).length

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute right-0 top-0 z-50 flex h-full w-96 flex-col border-l border-zinc-800 bg-zinc-950 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-amber-400">✦ Scan Chapter</p>
              <p className="max-w-60 truncate text-xs text-zinc-500">{chapterTitle}</p>
            </div>
            <button onClick={handleClose} className="text-zinc-500 hover:text-zinc-300">✕</button>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col overflow-y-auto p-4">

            {/* Idle */}
            {phase === 'idle' && (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-zinc-400">
                  Scan this chapter for characters, locations, terms, and factions that aren't yet in your world bible.
                </p>
                {error && (
                  <div className="rounded-md border border-red-900/50 bg-red-950/30 p-3">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}
                <button
                  onClick={handleScan}
                  className="w-full rounded-md bg-amber-500 px-3 py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-400"
                >
                  Scan now
                </button>
              </div>
            )}

            {/* Loading */}
            {phase === 'loading' && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-zinc-500">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
                <p className="text-sm">Reading chapter…</p>
              </div>
            )}

            {/* Empty */}
            {phase === 'empty' && (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 text-zinc-500">
                <span className="text-3xl">✓</span>
                <p className="text-sm">Nothing new found.</p>
                <p className="text-xs text-center text-zinc-600">All named entities in this chapter are already in your world bible.</p>
                <button
                  onClick={() => setPhase('idle')}
                  className="mt-4 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* Review */}
            {phase === 'review' && (
              <div className="flex flex-col gap-5">
                <p className="text-xs text-zinc-500">
                  Review and edit before adding to your world bible. All will be set as first introduced in <span className="text-zinc-300">"{chapterTitle}"</span>.
                </p>

                {ENTRY_TYPE_ORDER.map((type) => {
                  const group = candidates.filter((c) => c.type === type)
                  if (group.length === 0) return null
                  return (
                    <div key={type}>
                      <p className={`mb-2 text-xs font-semibold uppercase tracking-widest ${ENTRY_TYPE_COLORS[type]}`}>
                        {type}s
                      </p>
                      <div className="flex flex-col gap-2">
                        {group.map((c) => (
                          <div
                            key={c._key}
                            className={`flex gap-3 rounded-lg border p-3 transition-colors ${
                              c.accepted ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-800/50 bg-zinc-950 opacity-50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={c.accepted}
                              onChange={(e) => handleChange(c._key, { accepted: e.target.checked })}
                              className="mt-1 h-4 w-4 shrink-0 accent-amber-500"
                            />
                            <div className="flex min-w-0 flex-1 flex-col gap-1">
                              <input
                                value={c.name}
                                onChange={(e) => handleChange(c._key, { name: e.target.value })}
                                className="bg-transparent text-sm font-semibold text-zinc-100 outline-none focus:underline focus:decoration-amber-500/50"
                              />
                              {c.aliases.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {c.aliases.map((a, i) => (
                                    <span key={i} className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">
                                      {a}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <textarea
                                value={c.description}
                                onChange={(e) => handleChange(c._key, { description: e.target.value })}
                                rows={2}
                                className="resize-none bg-transparent text-xs text-zinc-400 outline-none focus:text-zinc-300"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer — only shown in review */}
          {phase === 'review' && (
            <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
              <button
                onClick={() => { setPhase('idle'); setCandidates([]) }}
                className="text-sm text-zinc-500 hover:text-zinc-300"
              >
                ← Rescan
              </button>
              <span className="text-xs text-zinc-600">{acceptedCount} of {candidates.length}</span>
              <button
                onClick={handleAccept}
                disabled={acceptedCount === 0}
                className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-40"
              >
                Add {acceptedCount > 0 ? acceptedCount : ''} to bible
              </button>
            </div>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
