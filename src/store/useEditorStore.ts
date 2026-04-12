'use client'

import { create } from 'zustand'
import type { SaveStatus } from '@/types'

interface EditorStore {
  isFullscreen: boolean
  sidebarCollapsed: boolean
  aiPanelOpen: boolean
  selectedText: string
  selectedRange: { start: number; end: number } | null
  saveStatus: SaveStatus
  toggleFullscreen: () => void
  toggleSidebar: () => void
  openAiPanel: (selectedText: string, range: { start: number; end: number }) => void
  closeAiPanel: () => void
  setSaveStatus: (status: SaveStatus) => void
}

export const useEditorStore = create<EditorStore>((set) => ({
  isFullscreen: false,
  sidebarCollapsed: false,
  aiPanelOpen: false,
  selectedText: '',
  selectedRange: null,
  saveStatus: 'saved',
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  openAiPanel: (selectedText, range) => set({ aiPanelOpen: true, selectedText, selectedRange: range }),
  closeAiPanel: () => set({ aiPanelOpen: false, selectedText: '', selectedRange: null }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),
}))
