'use client'

import { create } from 'zustand'
import type { Novel } from '@/types'

interface NovelStore {
  novels: Novel[]
  activeNovelId: string | null
  setNovels: (novels: Novel[]) => void
  setActiveNovel: (id: string) => void
  addNovel: (novel: Novel) => void
  updateNovel: (id: string, patch: Partial<Novel>) => void
  removeNovel: (id: string) => void
}

export const useNovelStore = create<NovelStore>((set) => ({
  novels: [],
  activeNovelId: null,
  setNovels: (novels) => set({ novels }),
  setActiveNovel: (id) => set({ activeNovelId: id }),
  addNovel: (novel) => set((s) => ({ novels: [...s.novels, novel] })),
  updateNovel: (id, patch) =>
    set((s) => ({
      novels: s.novels.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    })),
  removeNovel: (id) =>
    set((s) => ({ novels: s.novels.filter((n) => n.id !== id) })),
}))
