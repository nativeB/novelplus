'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { importNovel } from '@/lib/backup'
import { putNovel } from '@/lib/db/novels'
import { putChapters } from '@/lib/db/chapters'
import { putBibleEntries } from '@/lib/db/bible'

interface Props {
  onImported: (novelId: string) => void
}

export default function ImportBackupButton({ onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    inputRef.current?.click()
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const text = await file.text()
      const backup = importNovel(text)
      await putNovel(backup.novel)
      await putChapters(backup.chapters)
      await putBibleEntries(backup.bibleEntries)
      onImported(backup.novel.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import backup.')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="w-full border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100"
      >
        {loading ? 'Importing…' : 'Import backup (.json)'}
      </Button>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
