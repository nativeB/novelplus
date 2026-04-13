'use client'

import { useState } from 'react'
import { useChapterStore } from '@/store/useChapterStore'
import { useBibleStore } from '@/store/useBibleStore'
import { useNovelStore } from '@/store/useNovelStore'
import { exportNovel, importNovel, triggerDownload } from '@/lib/backup'
import { putNovel } from '@/lib/db/novels'
import { putChapters } from '@/lib/db/chapters'
import { putBibleEntries } from '@/lib/db/bible'
import { useRouter } from 'next/navigation'

interface Props {
  novelId: string
}

export default function BackupControls({ novelId }: Props) {
  const router = useRouter()
  const { novels, addNovel } = useNovelStore()
  const { chapters, setChapters } = useChapterStore()
  const { entries, setEntries } = useBibleStore()
  const novel = novels.find((n) => n.id === novelId)
  const [importError, setImportError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function handleExport() {
    if (!novel) return
    const json = exportNovel(novel, chapters, entries)
    const filename = `${novel.title.replace(/\s+/g, '-').toLowerCase()}.scriptor.json`
    triggerDownload(filename, json)
    showToast('Backup saved')
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImportError(null)
    try {
      const text = await file.text()
      const backup = importNovel(text)
      await putNovel(backup.novel)
      await putChapters(backup.chapters)
      await putBibleEntries(backup.bibleEntries)
      addNovel(backup.novel)
      setChapters(backup.chapters)
      setEntries(backup.bibleEntries)
      showToast('Novel restored')
      router.push(`/novel/${backup.novel.id}`)
    } catch (err) {
      setImportError(err instanceof Error ? err.message : 'Failed to import.')
    } finally {
      if (e.target) e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1 border-t border-zinc-800 pt-3">
      <p className="mb-1 text-xs font-medium uppercase tracking-widest text-zinc-600">Backup</p>
      <button
        onClick={handleExport}
        className="rounded-md px-3 py-2 text-left text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
      >
        ↓ Export backup
      </button>
      <label className="cursor-pointer rounded-md px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200">
        ↑ Import backup
        <input type="file" accept=".json" className="hidden" onChange={handleImport} />
      </label>
      {importError && <p className="px-3 text-xs text-red-400">{importError}</p>}
      {toast && (
        <p className="px-3 text-xs text-emerald-400">{toast}</p>
      )}
    </div>
  )
}
