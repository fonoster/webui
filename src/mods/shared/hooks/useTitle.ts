import { useCallback } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'

type Store = {
  title: string
  layout: string
  showGaps: boolean
  setTitle: (title: string) => void
  setLayout: (layout: string) => void
  removeGaps: () => void
  reset: () => void
}

const useStore = create<Store>(set => ({
  title: 'Console',
  layout: 'default',
  showGaps: true,
  removeGaps: () => set(() => ({ showGaps: false })),
  setLayout: layout => set(() => ({ layout })),
  setTitle: title => set(() => ({ title, layout: 'default', showGaps: true })),
  reset: () => set(() => ({ title: 'Console' })),
}))

export const useTitle = () =>
  useStore(
    useCallback(s => s, []),
    shallow
  )
