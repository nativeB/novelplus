'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNovelStore } from '@/store/useNovelStore'
import { useDBInit } from '@/hooks/useDBInit'
import { generateId } from '@/lib/utils'
import { putNovel } from '@/lib/db/novels'
import type { Novel } from '@/types'

export default function Home() {
  const router = useRouter()
  const { novels, addNovel } = useNovelStore()
  const { ready } = useDBInit()
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState('')
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    setCreating(true)
    const novel: Novel = { id: generateId(), title: t, createdAt: Date.now(), updatedAt: Date.now() }
    await putNovel(novel)
    addNovel(novel)
    router.push(`/novel/${novel.id}`)
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-amber-400" />
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-8 bg-zinc-950 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Scriptor</h1>
        <p className="mt-1 text-sm text-zinc-500">Your novels</p>
      </div>

      {novels.length > 0 && (
        <div className="flex w-full max-w-sm flex-col gap-2">
          {novels.map((n) => (
            <button
              key={n.id}
              onClick={() => router.push(`/novel/${n.id}`)}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-800"
            >
              <span className="text-sm font-medium text-zinc-100">{n.title}</span>
              <span className="text-xs text-zinc-600">→</span>
            </button>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleCreate} className="flex w-full max-w-sm flex-col gap-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Novel title…"
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-amber-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating || !title.trim()}
              className="flex-1 rounded-md bg-amber-500 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-40"
            >
              {creating ? 'Creating…' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setTitle('') }}
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-400 transition-colors hover:border-zinc-500 hover:text-zinc-200"
        >
          + New novel
        </button>
      )}
    </div>
  )
}
