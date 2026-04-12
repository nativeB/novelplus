'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Draggable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import type { Chapter } from '@/types'

interface Props {
  chapter: Chapter
  novelId: string
  index: number
}

export default function ChapterListItem({ chapter, novelId, index }: Props) {
  const pathname = usePathname()
  const href = `/novel/${novelId}/chapter/${chapter.id}`
  const active = pathname === href

  return (
    <Draggable draggableId={chapter.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            'group flex items-start gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200',
            snapshot.isDragging && 'bg-zinc-800 opacity-90 shadow-lg ring-1 ring-amber-500/30'
          )}
        >
          <span className="mt-0.5 cursor-grab text-zinc-600 opacity-0 group-hover:opacity-100">⠿</span>
          <Link href={href} className="min-w-0 flex-1">
            <p className="truncate font-medium">{chapter.title}</p>
            <p className="text-xs text-zinc-600">{chapter.wordCount.toLocaleString()} words</p>
          </Link>
        </div>
      )}
    </Draggable>
  )
}
