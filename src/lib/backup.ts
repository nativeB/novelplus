import type { BackupFile, Novel, Chapter, BibleEntry } from '@/types'

export function exportNovel(novel: Novel, chapters: Chapter[], entries: BibleEntry[]): string {
  const backup: BackupFile = {
    version: 1,
    exportedAt: Date.now(),
    novel,
    chapters,
    bibleEntries: entries,
  }
  return JSON.stringify(backup, null, 2)
}

export function importNovel(json: string): BackupFile {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch {
    throw new Error('Invalid backup file: not valid JSON.')
  }

  const b = parsed as BackupFile
  if (!b || typeof b !== 'object') throw new Error('Invalid backup file.')
  if (b.version !== 1) throw new Error(`Unsupported backup version: ${b.version}`)
  if (!b.novel?.id || !b.novel?.title) throw new Error('Invalid backup: missing novel data.')
  if (!Array.isArray(b.chapters)) throw new Error('Invalid backup: missing chapters.')
  if (!Array.isArray(b.bibleEntries)) throw new Error('Invalid backup: missing bible entries.')

  return b
}

export function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
