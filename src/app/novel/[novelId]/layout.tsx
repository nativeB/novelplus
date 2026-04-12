'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAllNovels } from '@/lib/db/novels'
import { getChaptersByNovel } from '@/lib/db/chapters'
import { getBibleEntriesByNovel } from '@/lib/db/bible'
import { useNovelStore } from '@/store/useNovelStore'
import { useChapterStore } from '@/store/useChapterStore'
import { useBibleStore } from '@/store/useBibleStore'
import AppSidebar from '@/components/sidebar/AppSidebar'

function NovelLoader({ novelId }: { novelId: string }) {
  const { setNovels, setActiveNovel } = useNovelStore()
  const { setChapters } = useChapterStore()
  const { setEntries } = useBibleStore()

  useEffect(() => {
    async function load() {
      const [novels, chapters, entries] = await Promise.all([
        getAllNovels(),
        getChaptersByNovel(novelId),
        getBibleEntriesByNovel(novelId),
      ])
      setNovels(novels)
      setActiveNovel(novelId)
      setChapters(chapters)
      setEntries(entries)
    }
    load()
  }, [novelId, setNovels, setActiveNovel, setChapters, setEntries])

  return null
}

function KeyboardShortcuts({ novelId }: { novelId: string }) {
  const router = useRouter()

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        router.push(`/novel/${novelId}/search`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [novelId, router])

  return null
}

export default function NovelLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const novelId = params.novelId as string

  return (
    <div className="flex h-screen overflow-hidden">
      <NovelLoader novelId={novelId} />
      <KeyboardShortcuts novelId={novelId} />
      <AppSidebar novelId={novelId} />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
