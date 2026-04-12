'use client'

import Link from 'next/link'
import { useNovelStore } from '@/store/useNovelStore'
import { useEditorStore } from '@/store/useEditorStore'
import { cn } from '@/lib/utils'
import ChapterList from './ChapterList'
import SidebarNav from './SidebarNav'
import BackupControls from '@/components/backup/BackupControls'

interface Props {
  novelId: string
}

export default function AppSidebar({ novelId }: Props) {
  const { novels } = useNovelStore()
  const { sidebarCollapsed, toggleSidebar } = useEditorStore()
  const novel = novels.find((n) => n.id === novelId)

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-200',
        sidebarCollapsed ? 'w-10' : 'w-64'
      )}
    >
      {sidebarCollapsed ? (
        <button
          onClick={toggleSidebar}
          className="flex h-full w-full items-start justify-center pt-4 text-zinc-500 hover:text-zinc-300"
          title="Expand sidebar"
        >
          ›
        </button>
      ) : (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="min-w-0 flex-1 truncate text-sm font-semibold text-zinc-200 hover:text-zinc-100">
              {novel?.title ?? 'Novel'}
            </Link>
            <button
              onClick={toggleSidebar}
              className="ml-1 shrink-0 rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
              title="Collapse sidebar"
            >
              ‹
            </button>
          </div>

          <ChapterList novelId={novelId} />
          <SidebarNav novelId={novelId} />

          <div className="mt-auto">
            <BackupControls novelId={novelId} />
          </div>
        </div>
      )}
    </aside>
  )
}
