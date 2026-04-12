'use client'

import { useParams, useSearchParams } from 'next/navigation'
import ChapterEditor from '@/components/editor/ChapterEditor'

export default function ChapterPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const chapterId = params.chapterId as string
  const novelId = params.novelId as string
  const highlightLine = searchParams.get('highlightLine')
    ? Number(searchParams.get('highlightLine'))
    : undefined

  return (
    <ChapterEditor
      chapterId={chapterId}
      novelId={novelId}
      highlightLine={highlightLine}
    />
  )
}
