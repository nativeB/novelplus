'use client'

import { create } from 'zustand'
import type { ConsistencyReport } from '@/types'

interface ConsistencyStore {
  reports: Record<string, ConsistencyReport>
  setReport: (novelId: string, report: ConsistencyReport) => void
  clearReport: (novelId: string) => void
}

export const useConsistencyStore = create<ConsistencyStore>((set) => ({
  reports: {},
  setReport: (novelId, report) =>
    set((s) => ({ reports: { ...s.reports, [novelId]: report } })),
  clearReport: (novelId) =>
    set((s) => {
      const reports = { ...s.reports }
      delete reports[novelId]
      return { reports }
    }),
}))
