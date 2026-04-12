'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useChapterStore } from '@/store/useChapterStore'

export default function NovelIndexPage() {
  const router = useRouter()
  const params = useParams()
  const novelId = params.novelId as string
  const { chapters } = useChapterStore()

  useEffect(() => {
    if (chapters.length > 0) {
      router.replace(`/novel/${novelId}/chapter/${chapters[0].id}`)
    }
  }, [chapters, novelId, router])

  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-600 border-t-amber-400" />
    </div>
  )
}
