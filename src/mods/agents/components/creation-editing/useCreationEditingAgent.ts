import type { Agent } from '@fonoster/agents/dist/client/types'
import { useCallback } from 'react'
import shallow from 'zustand/shallow'

import { createPanelStore } from '../../../shared/hooks/useCreatePanelStore'

const useStore = createPanelStore<Partial<Agent>>({
  name: '',
  username: '',
  secret: '',
  domains: [],
  privacy: 'Private',
})

export const useCreationEditingAgent = () =>
  useStore(
    useCallback(s => s, []),
    shallow
  )
