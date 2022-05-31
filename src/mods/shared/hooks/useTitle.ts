import { useCallback } from 'react'
import create from 'zustand'
import shallow from 'zustand/shallow'

type Store = {
  title: string
  layout: string
  setTitle: (title: string) => void
  setLayout: (layout: string) => void
  reset: () => void
}

const useStore = create<Store>(set => ({
  title: 'Console',
  layout: 'default',
  setLayout: layout => set(() => ({ layout })),
  setTitle: title => set(() => ({ title, layout: 'default' })),
  reset: () => set(() => ({ title: 'Console' })),
}))

export const useTitle = () =>
  useStore(
    useCallback(s => s, []),
    shallow
  )
