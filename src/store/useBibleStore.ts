'use client'

import { create } from 'zustand'
import type { BibleEntry } from '@/types'

interface BibleStore {
  entries: BibleEntry[]
  setEntries: (entries: BibleEntry[]) => void
  addEntry: (entry: BibleEntry) => void
  updateEntry: (id: string, patch: Partial<BibleEntry>) => void
  removeEntry: (id: string) => void
}

export const useBibleStore = create<BibleStore>((set) => ({
  entries: [],
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set((s) => ({ entries: [...s.entries, entry] })),
  updateEntry: (id, patch) =>
    set((s) => ({
      entries: s.entries.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    })),
  removeEntry: (id) =>
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) })),
}))
