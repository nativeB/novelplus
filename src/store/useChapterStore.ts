'use client'

import { create } from 'zustand'
import type { Chapter } from '@/types'
import { putChapters } from '@/lib/db/chapters'

interface ChapterStore {
  chapters: Chapter[]
  setChapters: (chapters: Chapter[]) => void
  addChapter: (chapter: Chapter) => void
  updateChapter: (id: string, patch: Partial<Chapter>) => void
  removeChapter: (id: string) => void
  reorderChapters: (sourceIndex: number, destIndex: number) => void
}

export const useChapterStore = create<ChapterStore>((set, get) => ({
  chapters: [],
  setChapters: (chapters) => set({ chapters }),
  addChapter: (chapter) =>
    set((s) => ({ chapters: [...s.chapters, chapter].sort((a, b) => a.order - b.order) })),
  updateChapter: (id, patch) =>
    set((s) => ({
      chapters: s.chapters.map((ch) => (ch.id === id ? { ...ch, ...patch } : ch)),
    })),
  removeChapter: (id) =>
    set((s) => ({ chapters: s.chapters.filter((ch) => ch.id !== id) })),
  reorderChapters: (sourceIndex, destIndex) => {
    const chapters = [...get().chapters]
    const [moved] = chapters.splice(sourceIndex, 1)
    chapters.splice(destIndex, 0, moved)
    const reordered = chapters.map((ch, i) => ({ ...ch, order: i }))
    set({ chapters: reordered })
    putChapters(reordered)
  },
}))
