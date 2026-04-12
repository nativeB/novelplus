'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { useChapterStore } from '@/store/useChapterStore'
import { putChapter } from '@/lib/db/chapters'
import { generateId } from '@/lib/utils'
import type { Chapter } from '@/types'
import ChapterListItem from './ChapterListItem'

interface Props {
  novelId: string
}

export default function ChapterList({ novelId }: Props) {
  const router = useRouter()
  const { chapters, reorderChapters, addChapter } = useChapterStore()
  const [adding, setAdding] = useState(false)

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    reorderChapters(result.source.index, result.destination.index)
  }

  async function handleAddChapter() {
    setAdding(true)
    const chapter: Chapter = {
      id: generateId(),
      novelId,
      order: chapters.length,
      title: `Chapter ${chapters.length + 1}`,
      content: '',
      wordCount: 0,
      updatedAt: Date.now(),
    }
    await putChapter(chapter)
    addChapter(chapter)
    router.push(`/novel/${novelId}/chapter/${chapter.id}`)
    setAdding(false)
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-1 flex items-center justify-between px-1">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">Chapters</span>
        <button
          onClick={handleAddChapter}
          disabled={adding}
          className="rounded px-1.5 py-0.5 text-xs text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        >
          + Add
        </button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-0.5">
              {chapters.map((chapter, index) => (
                <ChapterListItem key={chapter.id} chapter={chapter} novelId={novelId} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
