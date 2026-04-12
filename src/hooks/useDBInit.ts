'use client'

import { useEffect, useState } from 'react'
import { getDB } from '@/lib/db/client'
import { getAllNovels } from '@/lib/db/novels'
import { seedDemoNovel } from '@/lib/demo/seed'

export function useDBInit() {
  const [ready, setReady] = useState(false)
  const [seedNovelId, setSeedNovelId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      await getDB()
      const novels = await getAllNovels()
      if (novels.length === 0) {
        const id = await seedDemoNovel()
        setSeedNovelId(id)
      }
      setReady(true)
    }
    init()
  }, [])

  return { ready, seedNovelId }
}
